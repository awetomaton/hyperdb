import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from 'src/app/services/hyperdb.service';
import { HttpEventType } from '@angular/common/http';
import { Geometry } from 'src/app/interfaces/geometry';
import { NewMesh } from 'src/app/interfaces/mesh';
import { ContributorService } from 'src/app/services/contributor.service';


@Component({
  selector: 'app-new-mesh',
  templateUrl: './new-mesh.component.html',
  styleUrls: ['./new-mesh.component.scss']
})
export class NewMeshComponent {
  geometry: Geometry = {'id': -1, 'classification': '', 'contributor_fk': -1, 'file': '', 'system_fk': -1};
  newMesh: NewMesh = {'contributor_fk': -1, 'file': '', 'geometry_fk': -1};
  formData: FormData;
  uploadProgress: number;

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router,
    public contributorService: ContributorService) {
    this.route.params.subscribe( params => {
      this.hyperdbService.getGeometry(params['id']).subscribe(geometry => {
        this.geometry = geometry;
        this.newMesh.geometry_fk = this.geometry.id;
      })
    })
  }

  onSave(): void {
    if (this.formData == null) {
      return;
    }
    this.hyperdbService.uploadMesh(this.formData)
    .subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      } else if (event.type == HttpEventType.Response) {
        this.newMesh.file = event.body['filepath']
        this.newMesh.contributor_fk = this.contributorService.contributor == null ? -1: this.contributorService.contributor?.id;
        this.hyperdbService.postMesh(this.newMesh).subscribe(mesh => {
          this.router.navigate(['/meshes/' + mesh.id]);
        })
      }
    })
  }

  invalidMesh(): boolean {
    return this.newMesh.file == '';
  }

  onFileSelected(event: any): void{
    const file: File = event.target.files[0];
    
    if (file) {
      this.newMesh.file = file.name;
      this.formData = new FormData();
      this.formData.append("file", file);
    }
  }

}
