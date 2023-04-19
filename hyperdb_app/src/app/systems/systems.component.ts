import { Component, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HyperdbService } from '../hyperdb.service';
import { Country } from '../interfaces/country';
import { MatSnackBar } from '@angular/material/snack-bar';
import { System } from '../interfaces/system';
import { ContributorService } from '../contributor.service';


export interface SystemsSummary {
  system: System;
  country: Country | null;
  classification: string;
  geometries: number;
  meshes: number;
  comments: number;
}


@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: [
    '../app.component.scss',
    './systems.component.scss'
  ]
})
export class SystemsComponent implements OnInit {
  displayedColumns = ['name', 'country', 'classification', 'geometries', 'meshes', 'comments', 'delete'];
  systemsSummary: SystemsSummary[] = [];
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(
    private hyperdbService: HyperdbService, 
    public contributorService: ContributorService,
    private snackBar: MatSnackBar, 
    ) { }

  ngOnInit(): void {
    this.getSystemsSummary();
  }

  onDeleteSystem(system: System): void{
    this.hyperdbService.deleteSystem(system.id)
    .subscribe(response => {
      if (response) {
        this.snackBar.open("Success", 'Dismiss', {
          duration: 1000
        })
      }
      this.getSystemsSummary();
    })
  }

  getSystemsSummary(): void {
    this.hyperdbService.getSystems()
    .subscribe(systems => {
      this.hyperdbService.getGeometries()
      .subscribe(geometries => {
        this.hyperdbService.getSystemsComments()
        .subscribe(comments => {
          this.hyperdbService.getMeshes()
          .subscribe(meshes => {
            this.hyperdbService.getCountries()
            .subscribe(countries => {
              let newSystemsSummary: SystemsSummary[] = []
              for (let system of systems) {
                let numComments = 0;
                for (let comment of comments) {
                  if (comment.system_fk == system.id) {
                    numComments += 1;
                  }
                }

                let numGeometries = 0;
                let systemGeometries = [];
                for (let geometry of geometries) {
                  if (geometry.system_fk == system.id) {
                    numGeometries += 1;
                    systemGeometries.push(geometry.id);
                  }
                }

                let numMeshes = 0;
                for (let mesh of meshes) {
                  if (systemGeometries.indexOf(mesh.id) > -1) {
                    numMeshes += 1;
                  }
                }

                let associated_country: Country | null = null;     
                for (let country of countries) {
                  if (country.id == system.country_fk) {
                    associated_country = country;
                  }
                }

                let systemSummary: SystemsSummary = {
                  system: system,
                  country: associated_country,
                  classification: system.classification,
                  geometries: numGeometries,
                  meshes: numMeshes,
                  comments: numComments
                };
                newSystemsSummary.push(systemSummary)
              }
              this.systemsSummary = newSystemsSummary;
            });
          });
        });
      });
    });
  }
}
