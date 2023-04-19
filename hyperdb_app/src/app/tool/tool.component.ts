import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewTool, Tool } from '../interfaces/tool';
import { ConfiguredTool } from '../interfaces/configured_tool';
import { ContributorService } from '../contributor.service';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';


export interface ToolVersionSummary {
  tool: Tool;
  configurations: number;
}



@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: [
    './tool.component.scss',
    '../app.component.scss'
  ]
})
export class ToolComponent implements OnInit {
  newTool = false;
  tool: Tool = {'id': -1, 'name': '', 'version': ''};
  tools: Tool[] = [];
  configuredTools: ConfiguredTool[] = [];
  faPlus = faPlus
  faTrash = faTrash
  toolVersionSummaries: ToolVersionSummary[] = [];
  displayedColumns = ['version', 'configurations', 'delete'];

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    public contributorService: ContributorService){

    this.route.params.subscribe( params => {
      if (params['name'] != 'new') {
        this.tool.name = params['name'];
        this.hyperdbService.getTools(params['name']).subscribe(tools => {
          this.tools = tools;
        })
      } else {
        this.newTool = true;
      }
    })
  }

  ngOnInit(): void {
    if (this.newTool) {
      return;
    }

    this.hyperdbService.getTools(this.tool.name).subscribe(tools => {
      this.hyperdbService.getConfiguredTools().subscribe(configuredTools => {
        let toolVersionSummaries: ToolVersionSummary[] = [];
        for (let tool of tools) {
          let configurations = 0;
          for (let configuredTool of configuredTools) {
            if (configuredTool.tool_fk == tool.id) {
              configurations += 1;
            }
          }
          let toolVersionSummary: ToolVersionSummary = {'tool': tool, 'configurations': configurations};
          toolVersionSummaries.push(toolVersionSummary);
        }
        this.toolVersionSummaries = toolVersionSummaries;
      })
    })
  }

  saveTool(): void {
    let newTool: NewTool = {
      'name': this.tool.name,
      'version': this.tool.version,
    }
    this.hyperdbService.postTool(newTool)
    .subscribe(tool => {
      if (tool) {
        this.router.navigate(['/tools/' + this.tool.name + "/" + tool.id]);
      }
    })
  }

  onDeleteToolVersion(tool: Tool): void {

  }
}
