import { Component, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Geometry } from '../interfaces/geometry';
import { HyperdbService } from '../hyperdb.service';
import { Contributor } from '../interfaces/contributor';


export interface ContributorSummary {
  contributor: Contributor;
  geometries: number;
  meshes: number;
  comments: number;
}

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: [
    './contributors.component.scss',
    '../app.component.scss',
  ]
})
export class ContributorsComponent {
  displayedColumns = ['file', 'system', 'classification', 'meshes', 'comments', 'delete'];
  geometrySummaries: ContributorSummary[] = [];
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(private hyperdbService: HyperdbService) { }

  ngOnInit(): void {
    this.getGeometriesSummary();
  }

  onDeleteGeometry(geometry: Geometry): void{
    this.hyperdbService.deleteGeometry(geometry.id)
    .subscribe(response => {
      this.getGeometriesSummary();
    })
  }

  getGeometriesSummary(): void {
  }
}
