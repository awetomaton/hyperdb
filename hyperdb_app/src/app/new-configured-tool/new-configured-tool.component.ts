import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { Tool } from '../interfaces/tool';
import { NewConfiguredTool } from '../interfaces/configured_tool';
import { ContributorService } from '../contributor.service';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CBAeroSettingComponent } from '../cbaero-setting/cbaero-setting.component';
import { NewCBAeroSettingComponent } from '../new-cbaero-setting/new-cbaero-setting.component';
import { NewCart3DSettingComponent } from '../new-cart3d-setting/new-cart3d-setting.component';
import { ToolSetting } from '../interfaces/tool_setting';


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
  private newCBAeroSettingComponent: NewCBAeroSettingComponent;
  @ViewChild(NewCart3DSettingComponent)
  private newCart3DSettingComponent: NewCart3DSettingComponent;

  faPlus = faPlus;
  faTrash = faTrash;
  cart3d: boolean = false;
  cbaero: boolean = false;
  tool: Tool = {'id': -1, 'name': '', 'version': ''};
  configuredTool: NewConfiguredTool = {'name': '', 'tool_fk': -1, tool_settings_fk: -1}

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router,
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
        this.configuredTool.tool_fk = this.tool.id;
      })
    })
  }

  onSave(): void {
    if (this.cbaero) {
      //this.newCBAeroSettingComponent.saved.subscribe(setting => this.save(setting))
      this.newCBAeroSettingComponent.save();
    } else if (this.cart3d) {
      this.newCart3DSettingComponent.saved.subscribe(setting => this.save(setting))
      this.newCart3DSettingComponent.save();
    } else {
      return;
    }
  }

  save(setting: ToolSetting): void {
    this.configuredTool.tool_settings_fk = setting.id;
    this.hyperdbService.postConfiguredTool(this.configuredTool).subscribe(configuredTool => {
      this.router.navigate(['../', configuredTool.id], {relativeTo: this.route})
    })
  }

  invalidToolSetting(): boolean {
    let invalid: boolean = this.configuredTool.name == '';
    if (this.cbaero) {
      invalid = invalid || (this.newCBAeroSettingComponent != undefined && this.newCBAeroSettingComponent.confFile == '');
    } else if (this.cart3d) {
      invalid = invalid || (this.newCart3DSettingComponent != undefined && this.newCart3DSettingComponent.cntlFile == '');
    }
    return invalid;
  }
}
