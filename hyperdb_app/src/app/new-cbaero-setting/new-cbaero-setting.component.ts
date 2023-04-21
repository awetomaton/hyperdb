import { Component } from '@angular/core';
import { ContributorService } from '../contributor.service';

@Component({
  selector: 'hyperdb-new-cbaero-setting',
  templateUrl: './new-cbaero-setting.component.html',
  styleUrls: ['./new-cbaero-setting.component.scss']
})
export class NewCBAeroSettingComponent {
  confFile: string = '';
  formData: FormData;

  constructor(
    public contributorService: ContributorService) {
  }

  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    
    if (file) {
      this.confFile = file.name;
      this.formData = new FormData();
      this.formData.append("file", file);
    }
  }
}
