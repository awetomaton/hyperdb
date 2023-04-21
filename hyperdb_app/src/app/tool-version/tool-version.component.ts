import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewTool, Tool } from '../interfaces/tool';
import { ConfiguredTool } from '../interfaces/configured_tool';
import { ContributorService } from '../contributor.service';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-tool-version',
  templateUrl: './tool-version.component.html',
  styleUrls: [
    './tool-version.component.scss',
  ]
})
export class ToolVersionComponent {
  faPlus = faPlus;
  faTrash = faTrash;
  newTool: boolean = false;
  tool: Tool = {'id': -1, 'name': '', 'version': ''};
  configuredTools: ConfiguredTool[] = [];

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    public contributorService: ContributorService)
  {
    this.route.params.subscribe( params => {
      if (params['version'] != 'new') {
        this.hyperdbService.getTools(params['name'], params['version']).subscribe(tools => {
          this.tool = tools[0];
          this.getToolConfigurations();
          this.newTool = false;
        })
      } else {
        this.newTool = true;
        this.tool.name = params['name'];
      }
    })
  }

  getToolConfigurations(): void{
    this.hyperdbService.getToolConfigurations(this.tool.id).subscribe(configuredTools => {
      this.configuredTools = configuredTools;
    })
  }

  save(): void{
    let newTool: NewTool = {
      'name': this.tool.name,
      'version': this.tool.version,
    }
    this.hyperdbService.postTool(newTool)
    .subscribe(tool => {
      if (tool) {
        this.router.navigate(['/tools/' + this.tool.name + "/" + tool.version]);
      }
    })
  }

  onDeleteConfiguration(configuredTool: ConfiguredTool): void{
    this.hyperdbService.deleteConfiguredTool(configuredTool.id).subscribe(response => {
      if (response) {
        this.snackBar.open("Success", 'Dismiss', {
          duration: 1000
        })
      }
      this.getToolConfigurations();
    })
  }
}
