import { Component } from '@angular/core';

@Component({
  selector: 'classification',
  templateUrl: './classification.component.html',
  styleUrls: [
    './classification.component.scss',
    '../classification.scss'
  ]
})
export class ClassificationComponent {
  classification: String = 'UNCLASSIFIED'
  classificationLevel: String = 'unclassified'
}
