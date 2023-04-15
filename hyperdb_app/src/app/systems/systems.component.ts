import { Component, OnInit } from '@angular/core';
import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import { HyperdbService } from '../hyperdb.service';


export interface SystemsSummary {
  selected: boolean;
  name: string;
  country: string | null;
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
  displayedColumns = ['selected', 'name', 'country', 'classification', 'geometries', 'meshes', 'comments'];
  systemsSummary: SystemsSummary[] = [];
  faDownload = faDownload;
  faPlus = faPlus;

  constructor(private hyperdbService: HyperdbService) { }

  ngOnInit(): void {
    this.getSystemsSummary();
  }

  getSystemsSummary(): void {
    this.hyperdbService.getSystems()
    .subscribe(systems => {
      this.hyperdbService.getGeometries()
      .subscribe(geometries => {
        this.hyperdbService.getComments('system')
        .subscribe(comments => {
          this.hyperdbService.getSystemCountryAssociations()
          .subscribe(country_system_associations => {
            this.hyperdbService.getMeshes()
            .subscribe(meshes => {
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

                let country: string | null = null;

                let systemSummary: SystemsSummary = {
                  selected: false,
                  name: system.name,
                  country: country,
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
