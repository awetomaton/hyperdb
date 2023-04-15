import { Component, OnInit} from '@angular/core';
import { System } from '../interfaces/system';
import { Geometry } from '../interfaces/geometry';
import { Tool } from '../interfaces/tool';
import { Contributor } from '../interfaces/contributor';
import { HyperdbService } from '../hyperdb.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
    '../app.component.scss',
    '../classification.scss'
  ],
})
export class DashboardComponent implements OnInit {
  contributors: Contributor[] = [];
  geometries: Geometry[] = [];
  systems: System[] = [];
  tools: Tool[] = [];

  constructor(private hyperdbService: HyperdbService) { }

  ngOnInit(): void {
    
    this.getContributors();
    this.getGeometries();
    this.getSystems();
    this.getTools();
  }

  getContributors(): void {
    this.hyperdbService.getContributors()
    .subscribe(contributors => this.contributors = contributors);
  }

  getGeometries(): void {
    this.hyperdbService.getGeometries()
    .subscribe(geometries => this.geometries = geometries);
  }

  getSystems(): void {
    this.hyperdbService.getSystems()
    .subscribe(systems => this.systems = systems);
  }

  getTools(): void {
    this.hyperdbService.getTools()
    .subscribe(tools => this.tools = tools);
  }
}
