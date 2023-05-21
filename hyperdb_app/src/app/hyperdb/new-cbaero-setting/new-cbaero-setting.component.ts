import { Component, EventEmitter } from '@angular/core';
import { ContributorService } from 'src/app/services/contributor.service';
import { CBAeroSetting, NewCBAeroSetting } from 'src/app/interfaces/cbaero_setting';
import { HttpEventType } from '@angular/common/http';
import { NewToolSetting, ToolSetting } from 'src/app/interfaces/tool_setting';
import { HyperdbService } from 'src/app/services/hyperdb.service';


@Component({
  selector: 'hyperdb-new-cbaero-setting',
  templateUrl: './new-cbaero-setting.component.html',
  styleUrls: ['./new-cbaero-setting.component.scss']
})
export class NewCBAeroSettingComponent {
  confFile: string = '';
  formData: FormData;
  uploadProgress: number = -1;
  setting: CBAeroSetting = {'conf_file': '', 'id': -1};
  saved = new EventEmitter<ToolSetting>();

  constructor(
    public contributorService: ContributorService,
    private hyperdbService: HyperdbService,
    ) {}

  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    
    if (file) {
      this.confFile = file.name;
      this.formData = new FormData();
      this.formData.append("file", file);
    }
  }

  save(): void {
    this.hyperdbService.uploadToolSetting(this.formData)
    .subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      } else if (event.type == HttpEventType.Response) {
        this.uploadProgress = -1;
        let newCBAeroSetting: NewCBAeroSetting = {
          'conf_file': this.setting.conf_file = event.body['filepath']
        };
        this.hyperdbService.postCBAeroSetting(newCBAeroSetting).subscribe(setting => {
          this.setting = setting;
          let newToolSetting: NewToolSetting = {'cart3d_settings_fk': null, 'cbaero_settings_fk': this.setting.id};
          this.hyperdbService.postToolSetting(newToolSetting).subscribe(toolSetting => {
            this.saved.emit(toolSetting);
          })
        })
      }
    })
  }
}
