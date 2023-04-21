import { Component } from '@angular/core';
import { ContributorService } from '../contributor.service';

@Component({
  selector: 'hyperdb-new-cart3d-setting',
  templateUrl: './new-cart3d-setting.component.html',
  styleUrls: ['./new-cart3d-setting.component.scss']
})
export class NewCart3DSettingComponent {
  cntlFile: string = '';
  formData: FormData;

  constructor(
    public contributorService: ContributorService) {
  }

  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    
    if (file) {
      this.cntlFile = file.name;
      this.formData = new FormData();
      this.formData.append("file", file);
    }
  }
}
