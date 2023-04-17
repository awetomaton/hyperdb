import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { System } from '../interfaces/system';


@Component({
  selector: 'hyperdb-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {
  id: number = -1;
  system: System | null = null;


  constructor(private route: ActivatedRoute, private hyperdbService: HyperdbService){
    this.route.params.subscribe( params => {
      if (params['id'] != 'new') {
        this.id = parseInt(params['id']);
      }
    })
  }

  ngOnInit(): void {
    if (this.id != -1) {
      this.hyperdbService.getSystem(this.id)
      .subscribe(system => {
        this.system = system;
      })
    } else {
      this.system = {'classification': '', 'country_fk': null, 'id': -1, 'name': ''}
    }
  }
}
