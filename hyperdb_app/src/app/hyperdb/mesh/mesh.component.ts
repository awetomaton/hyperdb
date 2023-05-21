import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HyperdbService } from 'src/app/services/hyperdb.service';
import { Mesh } from 'src/app/interfaces/mesh';
import { ContributorService } from 'src/app/services/contributor.service';
import { Comment } from 'src/app/interfaces/comment';
import { Geometry } from 'src/app/interfaces/geometry';
import { System } from 'src/app/interfaces/system';
import { Contributor } from 'src/app/interfaces/contributor';
import { ConfiguredTool } from 'src/app/interfaces/configured_tool';

@Component({
  selector: 'app-mesh',
  templateUrl: './mesh.component.html',
  styleUrls: ['./mesh.component.scss']
})
export class MeshComponent {
  mesh: Mesh = {'contributor_fk': -1, 'file': '', 'geometry_fk': -1, 'id': -1};
  comments: Comment[] = [];
  contributor: Contributor = {'email': '', 'id': -1, 'name': ''};
  geometry: Geometry = {'classification': '', 'contributor_fk': -1, 'file': '', 'id': -1, 'system_fk': -1};
  system: System = {'id': -1, 'classification': '', 'country_fk': -1, 'name': ''};
  configuredTools: ConfiguredTool[] = [];

  constructor(
    private route: ActivatedRoute, 
    public hyperdbService: HyperdbService,
    public contributorService: ContributorService)
  {
    this.route.params.subscribe(params => {
      this.hyperdbService.getMesh(params['id']).subscribe(mesh => {
        this.mesh = mesh;
        this.hyperdbService.getContributor(this.mesh.contributor_fk).subscribe(contributor => {
          this.contributor = contributor;
        })
        this.hyperdbService.getMeshConfiguredTools(this.mesh.id).subscribe(configuredTools => {
          this.configuredTools = configuredTools;
        })
        this.hyperdbService.getGeometry(this.mesh.geometry_fk).subscribe(geometry => {
          this.geometry = geometry
          this.hyperdbService.getSystem(this.geometry.system_fk).subscribe(system => {
            this.system = system;
          })
        })
        this.getComments();
      })
    })
  }

  delete(): void{

  }

  getComments(): void{
    this.hyperdbService.getMeshComments(this.mesh.id).subscribe(comments => {
      this.comments = comments;
    })
  }
}