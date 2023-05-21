import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HyperdbService } from 'src/app/services/hyperdb.service';
import { Tool } from 'src/app/interfaces/tool';
import { AeroRun } from 'src/app/interfaces/aero_run';
import { ConfiguredTool } from 'src/app/interfaces/configured_tool';
import { ContributorService } from 'src/app/services/contributor.service';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Comment } from 'src/app/interfaces/comment';
import { Mesh } from 'src/app/interfaces/mesh';


@Component({
  selector: 'app-configured-tool',
  templateUrl: './configured-tool.component.html',
  styleUrls: [
    './configured-tool.component.scss',
  ]
})
export class ConfiguredToolComponent {
  faPlus = faPlus;
  faTrash = faTrash;
  tool: Tool = {'id': -1, 'name': '', 'version': ''};
  cbaeroId: number;
  cart3dId: number;
  meshes: Mesh[] = [];
  comments: Comment[] = [];
  aeroRuns: AeroRun[] = [];
  configuredTool: ConfiguredTool = {'id': -1, 'name': '', 'tool_fk': -1, tool_settings_fk: -1}

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService,
    public contributorService: ContributorService)
  {
    this.route.params.subscribe(params => {
      this.hyperdbService.getTools(params['name'], params['version']).subscribe(tools => {
        this.tool = tools[0];
        this.hyperdbService.getConfiguredTool(parseInt(params['id'])).subscribe(configuredTool => {
          this.hyperdbService.getToolSetting(configuredTool.tool_settings_fk).subscribe(toolSetting => {
            if (toolSetting.cbaero_settings_fk) {
              this.cbaeroId = toolSetting.cbaero_settings_fk;
            } else if (toolSetting.cart3d_settings_fk) {
              this.cart3dId = toolSetting.cart3d_settings_fk;
            }
          })
          this.configuredTool = configuredTool;

          this.hyperdbService.getConfiguredToolMeshes(this.configuredTool.id).subscribe(meshes => {
            this.meshes = meshes;
          })
          this.getComments();
        })
      })
    })
  }

  getComments(): void{
    this.hyperdbService.getConfiguredToolComments(this.configuredTool.id)
    .subscribe(comments => {
      this.comments = comments;
    })
  }
}
