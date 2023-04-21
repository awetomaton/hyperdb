import { Component, Input } from '@angular/core';


@Component({
  selector: 'classification',
  templateUrl: './classification.component.html',
  styleUrls: [
    './classification.component.scss',
    '../classification.scss'
  ]
})
export class ClassificationComponent {
  @Input() classification: String = '';

  getClassificationClass(): string {
    let classificationClass: string = '';
    if (this.classification.includes("TOP SECRET")){
      classificationClass = "top_secret";
    }else if (this.classification.includes("SECRET")) {
      classificationClass = "secret";
    }else if (this.classification.includes("UNCLASSIFIED")) {
      classificationClass = "unclassified";
    }
    return classificationClass;
  }
}
