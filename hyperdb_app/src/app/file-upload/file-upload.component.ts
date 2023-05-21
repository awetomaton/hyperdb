import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"]
})
export class FileUploadComponent {
  /*https://blog.angular-university.io/angular-file-upload/*/

    @Input() requiredFileType: string;
    @Output() fileSelected = new EventEmitter<any>();

    fileName = '';
    uploadProgress: number | null;
    uploadSub: Subscription | null;

    onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.fileSelected.emit(event);
      }
    }
}