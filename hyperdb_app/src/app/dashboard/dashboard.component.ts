import { Component, OnInit} from '@angular/core';
import { System } from '../interfaces/system';
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
  systems: System[] = [];

  constructor(private hyperdbService: HyperdbService) { }

  ngOnInit(): void {
    this.getSystems();
  }

  getSystems(): void {
    this.hyperdbService.getSystems()
    .subscribe(systems => this.systems = systems);
  }
}
