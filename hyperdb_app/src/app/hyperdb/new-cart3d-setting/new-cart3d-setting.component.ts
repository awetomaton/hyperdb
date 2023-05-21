import { Component, EventEmitter } from '@angular/core';
import { ContributorService } from 'src/app/services/contributor.service';
import { Cart3DSetting, NewCart3DSetting } from 'src/app/interfaces/cart3d_setting';
import { NewToolSetting, ToolSetting } from 'src/app/interfaces/tool_setting';
import { HttpEventType } from '@angular/common/http';
import { HyperdbService } from 'src/app/services/hyperdb.service';


@Component({
  selector: 'hyperdb-new-cart3d-setting',
  templateUrl: './new-cart3d-setting.component.html',
  styleUrls: ['./new-cart3d-setting.component.scss']
})
export class NewCart3DSettingComponent {
  cntlFile: string = '';
  formData: FormData;
  uploadProgress: number = -1;
  setting: Cart3DSetting = {'cntl_file': '', 'id': -1};
  saved = new EventEmitter<ToolSetting>();

  constructor(
    public contributorService: ContributorService,
    private hyperdbService: HyperdbService,
    ) {
  }

  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    
    if (file) {
      this.cntlFile = file.name;
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
        let newCart3DSetting: NewCart3DSetting = {
          'cntl_file': this.setting.cntl_file = event.body['filepath']
        };
        this.hyperdbService.postCart3DSetting(newCart3DSetting).subscribe(setting => {
          this.setting = setting;
          let newToolSetting: NewToolSetting = {'cart3d_settings_fk': this.setting.id, 'cbaero_settings_fk': null};
          this.hyperdbService.postToolSetting(newToolSetting).subscribe(toolSetting => {
            this.saved.emit(toolSetting);
          })
        })
      }
    })
  }
}
