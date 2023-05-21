import { Component } from '@angular/core';
import { HyperdbService } from 'src/app/services/hyperdb.service';
import { ActivatedRoute } from '@angular/router';
import { Contributor } from 'src/app/interfaces/contributor';
import { Comment } from 'src/app/interfaces/comment';
import { Geometry } from 'src/app/interfaces/geometry';
import { ToolGeometryAssociation } from 'src/app/interfaces/tool_geometry_association';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Mesh } from 'src/app/interfaces/mesh';
import { ContributorService } from 'src/app/services/contributor.service';
import { ConfiguredTool } from 'src/app/interfaces/configured_tool';
import { Tool } from 'src/app/interfaces/tool';


export interface LabeledToolGeometryAssociation {
  geometry: Geometry;
  tool: Tool;
  configuredTool: ConfiguredTool;
}

export interface LabeledToolMeshAssociation{
  mesh: Mesh;
  tool: Tool;
  configuredTool: ConfiguredTool;
}


@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: [
    './contributor.component.scss',
  ]
})
export class ContributorComponent {
  contributor: Contributor = {email: '', id: -1, name: ''};
  geometries: Geometry[] = [];
  comments: Comment[] = [];
  toolGeometryAssociations: LabeledToolGeometryAssociation[] = [];
  meshes: Mesh[] = [];
  faTrash = faTrash;
  toolMeshAssociations: LabeledToolMeshAssociation[] = [];

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    public contributorService: ContributorService) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      let contributorId = parseInt(params['id']);
      this.hyperdbService.getTools().subscribe(tools => {
        this.hyperdbService.getConfiguredTools().subscribe(configuredTools => {
          this.hyperdbService.getContributor(contributorId).subscribe(contributor => {
            this.contributor = contributor;
          });
          this.hyperdbService.getContributorComments(contributorId).subscribe(comments => {
            this.comments = comments;
          });
          this.hyperdbService.getContributorGeometries(contributorId).subscribe(geometries => {
            this.geometries = geometries;
          });
          this.hyperdbService.getGeometries().subscribe(geometries => {
            this.hyperdbService.getContributorToolGeometryAssociations(contributorId).subscribe(associations => {
              let toolGeometryAssociations: LabeledToolGeometryAssociation[] = []
              for (let association of associations) {
                let labelGeometry: Geometry = {
                  'classification' :'', 
                  'contributor_fk': -1, 
                  'file': '', 
                  'id': -1, 
                  'system_fk': -1
                };
                for (let geometry of geometries) {
                  if (geometry.id == association.geometry_fk){
                    labelGeometry = geometry
                    break;
                  }
                }
                let labelConfiguredTool: ConfiguredTool = {'id': -1, 'name': '', 'tool_fk': -1, 'tool_settings_fk': -1};
                let labelTool: Tool = {'id': -1, 'name': '', 'version': ''};
                for (let configuredTool of configuredTools) {
                  if (configuredTool.id == association.configured_tool_fk) {
                    labelConfiguredTool = configuredTool;
                    for (let tool of tools) {
                      if (tool.id == configuredTool.tool_fk) {
                        labelTool = tool;
                        break;
                      }
                    }
                    break;
                  }
                }
                let labeledAssociation: LabeledToolGeometryAssociation = {
                  'geometry': labelGeometry,
                  'tool': labelTool,
                  'configuredTool': labelConfiguredTool,
                };
                toolGeometryAssociations.push(labeledAssociation);
              }
              this.toolGeometryAssociations = toolGeometryAssociations;
            });
          })
          this.hyperdbService.getContributorMeshes(contributorId).subscribe(meshes => {
            this.meshes = meshes;
          });
          this.hyperdbService.getMeshes().subscribe(meshes => {
            this.hyperdbService.getContributorToolMeshAssociations(contributorId).subscribe(associations => {
              let toolMeshAssociations: LabeledToolMeshAssociation[] = []
              for (let association of associations) {
                let labelMesh: Mesh = {
                  'contributor_fk': -1, 
                  'file': '', 
                  'id': -1,
                  'geometry_fk': -1
                };
                for (let mesh of meshes) {
                  if (mesh.id == association.mesh_fk){
                    labelMesh = mesh
                    break;
                  }
                }
                let labelConfiguredTool: ConfiguredTool = {'id': -1, 'name': '', 'tool_fk': -1, 'tool_settings_fk': -1};
                let labelTool: Tool = {'id': -1, 'name': '', 'version': ''};
                for (let configuredTool of configuredTools) {
                  if (configuredTool.id == association.configured_tool_fk) {
                    labelConfiguredTool = configuredTool;
                    for (let tool of tools) {
                      if (tool.id == configuredTool.tool_fk) {
                        labelTool = tool;
                        break;
                      }
                    }
                    break;
                  }
                }
                let labeledAssociation: LabeledToolMeshAssociation = {
                  'mesh': labelMesh,
                  'tool': labelTool,
                  'configuredTool': labelConfiguredTool,
                };
                toolMeshAssociations.push(labeledAssociation);
              }
              this.toolMeshAssociations = toolMeshAssociations;
            });
          })
        })
      })
    })
  }

  getComments(): void {
    this.hyperdbService.getContributorComments(this.contributor.id)
    .subscribe(comments => {
      this.comments = comments;
    })
  }

  onDeleteGeometry(geometry: Geometry): void {

  }

  onDeleteToolGeometryAssociation(association: ToolGeometryAssociation): void {

  }

  onDeleteMesh(mesh: Mesh): void {

  }

  onDeleteToolMeshAssociation(mesh: Mesh): void {

  }
}
