import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { HttpEventType } from '@angular/common/http';
import { Comment } from '../interfaces/comment';
import { Geometry, NewGeometry } from '../interfaces/geometry';
import { Mesh } from '../interfaces/mesh';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { System } from '../interfaces/system';
import { Contributor } from '../interfaces/contributor';


@Component({
  selector: 'app-geometry',
  templateUrl: './geometry.component.html',
  styleUrls: [
    './geometry.component.scss',
    '../app.component.scss',
  ]
})
export class GeometryComponent implements OnInit {
  uploadProgress: number;
  comments: Comment[] = [];
  systems: System[] = [];
  contributors: Contributor[] = [];
  geometry: Geometry = {'id': -1, 'file': '', 'contributor_fk': -1, 'system_fk': -1, 'classification': ''};
  meshes: Mesh[] = [];
  fileFormData: FormData | null;
  fileControl = new FormControl('file', [
    Validators.required,
  ])
  contributorControl = new FormControl('contributor', [
    Validators.required,
  ])
  systemControl = new FormControl('system', [
    Validators.required,
  ])
  classificationControl = new FormControl('classification', [
    Validators.required,
    Validators.pattern('(UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET).*')
  ])
  geometryForm = new FormGroup({
    file: this.fileControl,
    contributor: this.contributorControl,
    system: this.systemControl,
    classification: this.classificationControl,
  });

  constructor(private route: ActivatedRoute, private hyperdbService: HyperdbService, private router: Router){
    this.route.params.subscribe( params => {
      let id: number;
      if (params['id'] != 'new') {
        id = parseInt(params['id']);
      } else {
        id = -1;
      }
      this.geometry.id = id;
    })
  }

  ngOnInit(): void {
    if (this.geometry.id != -1) {
      this.hyperdbService.getGeometry(this.geometry.id)
      .subscribe(geometry => {
        this.geometry = geometry;
        this.classificationControl.setValue(this.geometry.classification);
        this.hyperdbService.getSystems()
        .subscribe(systems => {
          for (let system of systems) {
            this.systemControl.setValue(system.name);
            break;
          }
          this.systems = systems;
        })

        this.hyperdbService.getContributors()
        .subscribe(contributors => {
          for (let contributor of contributors) {
            if (contributor.id == geometry.contributor_fk) {
              this.contributorControl.setValue(contributor.name);
              break;
            } 
          }
          this.contributors = contributors;
        })
      })

      this.hyperdbService.getGeometryComments(this.geometry.id)
      .subscribe(comments => {
        this.comments = comments;
      })

      this.hyperdbService.getGeometryMeshes(this.geometry.id)
      .subscribe(meshes => {
        this.meshes = meshes;
      })
    } else {
      this.hyperdbService.getSystems()
      .subscribe(systems => {
        this.systems = systems;
      })

      this.hyperdbService.getContributors()
      .subscribe(contributors => {
        this.contributors = contributors;
      })
    }
  }

  getComments(): void{
    this.hyperdbService.getGeometryComments(this.geometry.id)
    .subscribe(comments => {
      this.comments = comments;
    })
  }

  save(): void {
    if (this.fileFormData != null) {
      this.hyperdbService.uploadGeometry(this.fileFormData)
      .subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type == HttpEventType.Response) {
          this.geometry.file = event.body['filepath']
          this.fileFormData = null;
          this.saveGeometry();
        }
      })
    } else {
      this.saveGeometry();
    }
  }

  saveGeometry(): void {
    let contributorFk = -1
    for (let contributor of this.contributors) {
      if (contributor.name == this.contributorControl.value){
        contributorFk = contributor.id;
        break;
      }
    }
    let systemFk = -1
    for (let system of this.systems) {
      if (system.name == this.systemControl.value){
        systemFk = system.id
        break;
      }
    }

    if (this.geometry.id == -1){
      let newGeometry: NewGeometry = {
        'file': this.geometry.file,
        'contributor_fk': contributorFk,
        'system_fk': systemFk,
        'classification': this.classificationControl.value == null ? '': this.classificationControl.value
      }
    
      this.hyperdbService.postGeometry(newGeometry)
      .subscribe(geometry => {
        this.router.navigate(['/geometries', geometry.id])
      })  
    } else {
      let newGeometry: Geometry = {
        'id': this.geometry.id,
        'file': this.geometry.file,
        'contributor_fk': contributorFk,
        'system_fk': systemFk,
        'classification': this.classificationControl.value == null ? '': this.classificationControl.value
      }
      this.hyperdbService.putGeometry(newGeometry)
      .subscribe(geometry => {
        this.geometry = geometry;
      })  
    }
  }

  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    
    if (file) {
      this.geometry.file = file.name;
      this.fileFormData = new FormData();
      this.fileFormData.append("file", file);
    }
  }
}