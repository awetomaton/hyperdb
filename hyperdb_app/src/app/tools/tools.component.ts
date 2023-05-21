import { Component, OnInit } from '@angular/core';
import { HyperdbService } from 'src/app/services/hyperdb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ContributorService } from 'src/app/services/contributor.service';


export interface ToolSummary {
  tool: string;
  versions: number;
}


@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: [
    './tools.component.scss',
    '../app.component.scss'
  ]
})
export class ToolsComponent implements OnInit {
  displayedColumns = ['tool', 'versions'];
  toolSummaries: ToolSummary[] = [];
  faPlus = faPlus 
  faTrash = faTrash 

  constructor(
    private hyperdbService: HyperdbService, 
    private snackBar: MatSnackBar, 
    public contributorService: ContributorService
  ) { }

  ngOnInit(): void {
    this.getToolsSummary();
  }

  getToolsSummary(): void {
    this.hyperdbService.getTools().subscribe(tools => {
      let toolSummaries: ToolSummary[] = [];
      let versions: number[] = [];
      let uniqueTools: string[] = [];
      for (let tool of tools) {
        let index: number = uniqueTools.indexOf(tool.name);
        if ( index > -1) {
          versions[index] = versions[index] + 1;
        } else {
          uniqueTools.push(tool.name);
          versions.push(1);
        }
      }
      for (let i = 0; i < uniqueTools.length; i ++) {
        let toolSummary: ToolSummary = {
          'tool': uniqueTools[i],
          'versions': versions[i],
        };
        toolSummaries.push(toolSummary);
      }
      this.toolSummaries = toolSummaries;
    })
  }
}
