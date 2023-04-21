import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewTool, Tool } from '../interfaces/tool';
import { ConfiguredTool } from '../interfaces/configured_tool';
import { ContributorService } from '../contributor.service';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CBAeroSetting } from '../interfaces/cbaero_setting';
import { Cart3DSetting } from '../interfaces/cart3d_setting';
import { CBAeroSettingComponent } from '../cbaero-setting/cbaero-setting.component';
import { NewCBAeroSettingComponent } from '../new-cbaero-setting/new-cbaero-setting.component';
import { NewCart3DSettingComponent } from '../new-cart3d-setting/new-cart3d-setting.component';


@Component({
  selector: 'app-new-configured-tool',
  templateUrl: './new-configured-tool.component.html',
  styleUrls: [
    './new-configured-tool.component.scss',
    '../app.component.scss'
  ]
})
export class NewConfiguredToolComponent {
  @ViewChild(NewCBAeroSettingComponent)
  private newCBAeroComponent: NewCBAeroSettingComponent;
  @ViewChild(NewCart3DSettingComponent)
  private newCart3DSettingComponent: NewCart3DSettingComponent;

  faPlus = faPlus;
  faTrash = faTrash;
  cart3d: boolean = false;
  cbaero: boolean = false;
  tool: Tool = {'id': -1, 'name': '', 'version': ''};
  toolConfiguration: ConfiguredTool = {'id': -1, 'name': '', 'tool_fk': -1, tool_settings_fk: -1}

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    public contributorService: ContributorService)
  {
    this.route.params.subscribe(params => {
      this.hyperdbService.getTools(params['name'], params['version']).subscribe(tools => {
        this.tool = tools[0];
        if (this.tool.name == 'CBAero') {
          this.cbaero = true;
        } else if (this.tool.name == 'Cart3D') {
          this.cart3d = true;
        }
        this.toolConfiguration.tool_fk = this.tool.id;
      })
    })
  }

  save(): void {
    console.log(this.newCBAeroComponent.confFile);
  }

  invalidToolSetting(): boolean {
    if (this.cbaero) {
      if (this.newCBAeroComponent != undefined && this.newCBAeroComponent.confFile){
        return false;
      } else {
        return true;
      }
    } else if (this.cart3d) {
      if (this.newCart3DSettingComponent != undefined && this.newCart3DSettingComponent.cntlFile){
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
}
