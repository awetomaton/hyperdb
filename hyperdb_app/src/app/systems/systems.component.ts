import { Component } from '@angular/core';


export interface SystemsSummary {
  name: string;
  country: string;
  classification: string;
  geometries: number;
  meshes: number;
  comments: number;
}

const ELEMENT_DATA: SystemsSummary[] = [
  {name: 'test', country: 'Hydrogen', classification: 'UNCLASSIFIED', geometries: 5, meshes: 4, comments: 0},
];


@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: [
    '../app.component.scss',
    './systems.component.scss'
  ]
})
export class SystemsComponent {
  displayedColumns: string[] = ['name', 'country', 'classification', 'geometries', 'meshes', 'comments'];
  dataSource = ELEMENT_DATA;
}
