import { Component, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { System } from 'src/app/interfaces/system';
import { Geometry } from 'src/app/interfaces/geometry';
import { HyperdbService } from 'src/app/services/hyperdb.service';
import { ContributorService } from 'src/app/services/contributor.service';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface GeometrySummary {
  geometry: Geometry;
  system: System;
  classification: string;
  meshes: number;
  comments: number;
}


@Component({
  selector: 'app-geometries',
  templateUrl: './geometries.component.html',
  styleUrls: [
    './geometries.component.scss',
  ]
})
export class GeometriesComponent implements OnInit{
  displayedColumns = ['file', 'system', 'classification', 'meshes', 'comments', 'delete'];
  geometrySummaries: GeometrySummary[] = [];
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(
    private hyperdbService: HyperdbService, 
    public contributorService: ContributorService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.getGeometriesSummary();
  }

  onDeleteGeometry(geometry: Geometry): void{
    this.hyperdbService.deleteGeometry(geometry.id)
    .subscribe(response => {
      if (response) {
        this.snackBar.open("Success", 'Dismiss', {
          duration: 1000
        })
        this.getGeometriesSummary();
      }
    })
  }

  getGeometriesSummary(): void {
    this.hyperdbService.getGeometries()
    .subscribe(geometries => {
      this.hyperdbService.getSystems()
      .subscribe(systems => {
        this.hyperdbService.getMeshes()
        .subscribe(meshes => {
          this.hyperdbService.getComments()
          .subscribe(comments => {
            let geometrySummaries: GeometrySummary[] = [];
            for (let geometry of geometries) {
              let geometrySummary: GeometrySummary;
              let geometrySystem: System = {'name': '', 'id': -1, 'classification': '', 'country_fk': -1};
              let geometryMeshes = 0;
              let geometryComments = 0;
              for (let system of systems) {
                if (geometry.system_fk == system.id) {
                  geometrySystem = system;
                  break;
                }
              }
              for (let mesh of meshes) {
                if (mesh.geometry_fk == geometry.id) {
                  geometryMeshes += 1;
                }
              }
              for (let comment of comments) {
                if (comment.geometry_fk == geometry.id) {
                  geometryMeshes += 1;
                }
              }
              geometrySummary = {
                'geometry': geometry,
                'system': geometrySystem,
                'classification': geometry.classification,
                'meshes': geometryMeshes,
                'comments': geometryComments
              };
              geometrySummaries.push(geometrySummary)
            }
            this.geometrySummaries = geometrySummaries;
          });
        });
      });
    });
  }
}
