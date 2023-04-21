import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'classification',
  templateUrl: './classification.component.html',
  styleUrls: [
    './classification.component.scss',
    '../classification.scss'
  ]
})
export class ClassificationComponent implements OnInit {
  @Input() classification: String = '';
  classificationLevel: String = ''

  ngOnInit(): void {
    if (this.classification.includes("TOP SECRET")){
      this.classificationLevel = "top_secret";
    }else if (this.classification.includes("SECRET")) {
      this.classificationLevel = "secret";
    }else if (this.classification.includes("UNCLASSIFIED")) {
      this.classificationLevel = "unclassified";
    }
  }
}
