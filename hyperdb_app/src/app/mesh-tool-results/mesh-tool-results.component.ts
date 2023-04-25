import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { ConfiguredTool } from '../interfaces/configured_tool';
import { Mesh } from '../interfaces/mesh';
import { Geometry } from '../interfaces/geometry';
import { System } from '../interfaces/system';
import { Tool } from '../interfaces/tool';
import { AeroResult } from '../interfaces/aero_result';


@Component({
  selector: 'app-mesh-tool-results',
  templateUrl: './mesh-tool-results.component.html',
  styleUrls: ['./mesh-tool-results.component.scss']
})
export class MeshToolResultsComponent {
  mesh: Mesh = {'contributor_fk': -1, 'file': '', 'geometry_fk': -1, 'id': -1};
  geometry: Geometry = {'classification': '', 'contributor_fk': -1, 'file': '', 'id': -1, 'system_fk': -1};
  system: System = {'id': -1, 'classification': '', 'country_fk': -1, 'name': ''};
  tool: Tool = {'id': -1, 'name': '', 'version': ''};
  configuredTool: ConfiguredTool = {'id': -1, 'name': '', 'tool_fk': -1, 'tool_settings_fk': -1};
  aeroResults: AeroResult[] = [];
  displayedColumns = ['mach', 'alpha', 'lift_coefficient', 'drag_coefficient']

  constructor(
    private route: ActivatedRoute, 
    public hyperdbService: HyperdbService)
  {
    this.route.params.subscribe(params => {
      this.hyperdbService.getMesh(params['mesh_id']).subscribe(mesh => {
        this.mesh = mesh;
        this.hyperdbService.getGeometry(this.mesh.geometry_fk).subscribe(geometry => {
          this.geometry = geometry
          this.hyperdbService.getSystem(this.geometry.system_fk).subscribe(system => {
            this.system = system;
          })
        })
      })

      this.hyperdbService.getConfiguredTool(params['configured_tool_id']).subscribe(configuredTool => {
        this.configuredTool = configuredTool;
        this.hyperdbService.getTool(configuredTool.tool_fk).subscribe(tool =>{
          this.tool = tool;
        })
      })

      this.hyperdbService.getAeroResults(params['mesh_id'], params['configured_tool_id']).subscribe(aeroResults => {
        this.aeroResults = aeroResults;
      })
    })
  }
}
