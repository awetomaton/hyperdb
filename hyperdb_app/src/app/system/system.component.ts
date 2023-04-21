import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { Comment } from '../interfaces/comment';
import { System, NewSystem } from '../interfaces/system';
import { Country, NewCountry } from '../interfaces/country';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Geometry } from '../interfaces/geometry';
import { ContributorService } from '../contributor.service';


@Component({
  selector: 'hyperdb-system',
  templateUrl: './system.component.html',
  styleUrls: [
    './system.component.scss'
  ]
})
export class SystemComponent implements OnInit {
  comments: Comment[] = [];
  system: System = {'classification': '', 'country_fk': null, 'id': -1, 'name': ''};
  countries: Country[] = [];
  geometries: Geometry[] = [];
  filteredCountries: Observable<Country[]>;
  countryControl = new FormControl('country', [
    Validators.required,
    Validators.minLength(3),
  ])
  classificationControl = new FormControl('classification', [
    Validators.required,
    Validators.pattern('(UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET).*')
  ])
  systemForm = new FormGroup({
    country: this.countryControl,
    classification: this.classificationControl,
  });

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    public contributorService: ContributorService, 
    ){

    this.route.params.subscribe( params => {
      let id: number;
      if (params['id'] != 'new') {
        id = parseInt(params['id']);
      } else {
        id = -1;
      }
      this.system.id = id;
    })
  }

  ngOnInit(): void {
    if (this.system.id != -1) {
      this.hyperdbService.getSystem(this.system.id)
      .subscribe(system => {
        this.system = system;
        this.classificationControl.setValue(this.system.classification);
        this.hyperdbService.getCountries()
        .subscribe(countries => {
          for (let country of countries) {
            if (system.country_fk == country.id) {
              this.countryControl.setValue(country.alpha_three_code);
              break;
            }
          }
          this.countries = countries;
        })
      })

      this.hyperdbService.getSystemComments(this.system.id)
      .subscribe(comments => {
        this.comments = comments;
      })

      this.hyperdbService.getSystemGeometries(this.system.id)
      .subscribe(geometries => {
        this.geometries = geometries;
      })
    } else {
      this.hyperdbService.getCountries()
      .subscribe(countries => {
        this.countries = countries;
      })
    }

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): Country[] {
    const filterValue = value.toLowerCase();
    let filteredCountries: Country[] = [];
    for (let country of this.countries){
      if (country.alpha_three_code.toLowerCase().includes(filterValue)){
        filteredCountries.push(country);
      }
    }
    return filteredCountries;
  }

  save(): void {
    let countryFk: number = -1;

    for (let country of this.countries) {
      if (country.alpha_three_code == this.countryControl.value) {
        countryFk = country.id;
        break;
      }
    }
    if (countryFk == -1) {
      let newCountry: NewCountry = {
        'alpha_three_code': this.countryControl.value == null ? '': this.countryControl.value, 
        'icon': 'null'
      };
      this.hyperdbService.postCountry(newCountry)
      .subscribe(country => {
        this.saveSystem(country.id);
      })
    } else{
      this.saveSystem(countryFk);
    }
  }

  saveSystem(countryFk: number): void {
    if (this.system.id == -1) {
      let newSystem: NewSystem;
      newSystem = {
        'name': this.system.name, 
        'classification': this.classificationControl.value == null ? '': this.classificationControl.value, 
        'country_fk': countryFk
      };
      this.hyperdbService.postSystem(newSystem)
      .subscribe(system => {
        this.router.navigate(['/systems', system.id])
      })
    } else {
      let newSystem: System;
      newSystem = {
        'id': this.system.id,
        'name': this.system.name, 
        'classification': this.classificationControl.value == null ? '': this.classificationControl.value, 
        'country_fk': countryFk
      };
      this.hyperdbService.putSystem(newSystem)
      .subscribe(system => {
        this.system = system;
        this.snackBar.open("Success", 'Dismiss', {
          duration: 1000
        });
      })
    }
  }

  getComments(): void{
    this.hyperdbService.getSystemComments(this.system.id)
    .subscribe(comments => {
      this.comments = comments;
    })
  }
}
