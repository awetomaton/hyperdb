import { Component, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HyperdbService } from '../hyperdb.service';
import { Contributor } from '../interfaces/contributor';
import { ContributorService } from '../contributor.service';


export interface ContributorSummary {
  contributor: Contributor;
  geometries: number;
  toolGeometryAssociations: number;
  meshes: number;
  toolMeshAssociations: number;
  comments: number;
}

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: [
    './contributors.component.scss',
    '../app.component.scss',
  ]
})
export class ContributorsComponent implements OnInit {
  displayedColumns = ['name', 'geometries', 'tool-geometry-associations', 'meshes', 'tool-mesh-associations', 'comments'];
  contributorSummaries: ContributorSummary[] = [];
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(private hyperdbService: HyperdbService, public contributorService: ContributorService) { }

  ngOnInit(): void {
    this.getContributorsSummary();
  }

  getContributorsSummary(): void {
    this.hyperdbService.getContributors()
    .subscribe(contributors => {
      this.hyperdbService.getGeometries()
      .subscribe(geometries => {
        this.hyperdbService.getToolGeometryAssociations()
        .subscribe(toolGeometryAssociations => {
          this.hyperdbService.getMeshes()
          .subscribe(meshes => {
            this.hyperdbService.getToolMeshAssociations()
            .subscribe(toolMeshAssociations => {
              this.hyperdbService.getCommentsMeta()
              .subscribe(comments => {
                let contributorSummaries: ContributorSummary[] = [];
                for (let contributor of contributors) {
                  let numGeometries = 0;
                  for (let geometry of geometries) {
                    if (geometry.contributor_fk == contributor.id) {
                      numGeometries += 1;
                    }
                  }
                  let numToolGeometryAssociations = 0;
                  for (let toolGeometryAssociation of toolGeometryAssociations) {
                    if (toolGeometryAssociation.contributor_fk == contributor.id) {
                      numToolGeometryAssociations += 1;
                    }
                  }
                  let nmumMeshes = 0;
                  for (let mesh of meshes) {
                    if (mesh.contributor_fk == contributor.id) {
                      nmumMeshes += 1;
                    }
                  }
                  let numToolMeshAssociations = 0;
                  for (let toolmeshAssociation of toolMeshAssociations) {
                    if (toolmeshAssociation.contributor_fk == contributor.id) {
                      numToolMeshAssociations += 1;
                    }
                  }
                  let numComments = 0;
                  for (let comment of comments) {
                    if (comment.contributor_fk == contributor.id) {
                      numComments += 1;
                    }
                  }
                  let contributorSummary: ContributorSummary = {
                    'contributor': contributor,
                    'geometries': numGeometries,
                    'toolGeometryAssociations': numToolGeometryAssociations,
                    'meshes': nmumMeshes,
                    'toolMeshAssociations': numToolMeshAssociations,
                    'comments': numComments
                  }
                  contributorSummaries.push(contributorSummary);
                }
                this.contributorSummaries = contributorSummaries;
              })
            })
          })
        })
      })
    })
  }
}
