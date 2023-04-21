import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { HyperdbService } from '../hyperdb.service';
import { HttpEventType } from '@angular/common/http';
import { Comment } from '../interfaces/comment';
import { Geometry, NewGeometry } from '../interfaces/geometry';
import { Mesh } from '../interfaces/mesh';
import { System } from '../interfaces/system';
import { Contributor } from '../interfaces/contributor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToolTree } from '../interfaces/tool_tree';
import { ToolVersion } from '../interfaces/tool_version';
import { AssociatedConfiguredTool } from '../interfaces/configured_tool';
import { NewToolGeometryAssociation }  from '../interfaces/tool_geometry_association';
import { ContributorService } from '../contributor.service';


@Component({
  selector: 'app-geometry',
  templateUrl: './geometry.component.html',
  styleUrls: [
    './geometry.component.scss',
  ]
})
export class GeometryComponent implements OnInit {
  uploadProgress: number;
  comments: Comment[] = [];
  systems: System[] = [];
  contributor: Contributor = {'email': '', 'id': -1, 'name': ''};
  geometry: Geometry = {'id': -1, 'file': '', 'contributor_fk': -1, 'system_fk': -1, 'classification': ''};
  meshes: Mesh[] = [];
  toolTrees: ToolTree[] = [];
  fileFormData: FormData | null;
  fileControl = new FormControl('file', [
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
    system: this.systemControl,
    classification: this.classificationControl,
  });

  constructor(
    private route: ActivatedRoute, 
    private hyperdbService: HyperdbService, 
    private router: Router,
    private snackBar: MatSnackBar,
    public contributorService: ContributorService) {
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
              this.contributor = contributor;
              break;
            } 
          }
        })
        
        this.hyperdbService.getTools()
        .subscribe(tools => {
          this.hyperdbService.getConfiguredTools()
          .subscribe(configuredTools => {
            this.hyperdbService.getGeometryTools(this.geometry.id)
            .subscribe(geometryToolAssociations => {
              let toolTrees: ToolTree[] = [];
              let toolDict: any = {};
              for (let tool of tools) {
                if (!(tool.name in toolDict)) {
                  toolDict[tool.name] = [];
                }
                toolDict[tool.name].push(tool)
              }
              
              for (const toolName in toolDict) {
                let toolVersions: ToolVersion[] = [];
                for (let tool of toolDict[toolName]) {
                  let associatedConfiguredTools: AssociatedConfiguredTool[] = [];
                  for (let configuredTool of configuredTools) {
                    if (configuredTool.id != tool.id) {
                      continue;
                    }
                    let associated = false;
                    for (let geometryToolAssociation of geometryToolAssociations) {
                      if (geometryToolAssociation.configured_tool_fk == configuredTool.id) {
                        associated = true;
                        break;
                      }
                    }
                    let associatedConfiguredTool: AssociatedConfiguredTool = {
                      'associated': associated,
                      'configuredTool': configuredTool
                    }
                    associatedConfiguredTools.push(associatedConfiguredTool);
                  }
                  if (associatedConfiguredTools.length) {
                    let toolVersion: ToolVersion = {
                      'id': tool.id,
                      'version': tool.version,
                      'configurations': associatedConfiguredTools
                    };
                    toolVersions.push(toolVersion);
                  }
                }
                if (toolVersions.length) {
                  let toolTree: ToolTree = {'name': toolName, 'toolVersions': toolVersions}
                  toolTrees.push(toolTree);
                }
              }
              this.toolTrees = toolTrees;
            })
          })
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
    }
  }

  allToolSelected(toolTree: ToolTree): boolean {
    for (let toolVersion of toolTree.toolVersions) {
      if (!this.allVersionSelected(toolVersion)) {
        return false
      }
    }
    return true;
  }

  someToolSelected(toolTree: ToolTree): boolean {
    let anyUnselected = false;
    let someSelected = false;
    for (let toolVersion of toolTree.toolVersions) {
      for (let configuredTool of toolVersion.configurations) {
        if (configuredTool.associated) {
          someSelected = true;
        } else {
          anyUnselected = true;
        }
      }
    }
    return anyUnselected && someSelected;
  }

  selectAllTool(toolTree: ToolTree, checked: boolean): void {
    for (let toolVersion of toolTree.toolVersions) {
      this.selectAllVersion(toolVersion, checked);
    }
  }

  allVersionSelected(toolVersion: ToolVersion): boolean {
    for (let configuredTool of toolVersion.configurations) {
      if (!configuredTool.associated) {
        return false;
      }
    }
    return true;
  }

  someVersionSelected(toolVersion: ToolVersion): boolean {
    let anyUnselected = false;
    let someSelected = false;
    for (let configuredTool of toolVersion.configurations) {
      if (configuredTool.associated) {
        someSelected = true;
      } else {
        anyUnselected = true;
      }
    }
    return anyUnselected && someSelected;
  }

  selectAllVersion(toolVersion: ToolVersion, checked: boolean): void {
    for (let configuredTool of toolVersion.configurations) {
      configuredTool.associated = checked;
    }
  }

  getComments(): void{
    this.hyperdbService.getGeometryComments(this.geometry.id)
    .subscribe(comments => {
      this.comments = comments;
    })
  }

  saveProperties(): void {
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
        'contributor_fk': this.contributorService.contributor == null ? -1: this.contributorService.contributor.id,
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
        'contributor_fk': this.contributor.id,
        'system_fk': systemFk,
        'classification': this.classificationControl.value == null ? '': this.classificationControl.value
      }
      this.hyperdbService.putGeometry(newGeometry)
      .subscribe(geometry => {
        this.geometry = geometry;
        this.snackBar.open("Success", 'Dismiss', {
            duration: 1000
        })
      })  
    }
  }

  saveAssociations(): void {
    this.hyperdbService.deleteGeometryTools(this.geometry.id)
    .subscribe(response => {
      if (response == undefined) {
        return;
      }
      let associations: NewToolGeometryAssociation[] = [];
      for (let toolTree of this.toolTrees) {
        for (let toolVersion of toolTree.toolVersions) {
          for (let associatedConfiguredTool of toolVersion.configurations) {
            if (associatedConfiguredTool.associated) {
              associations.push({
                'configured_tool_fk': associatedConfiguredTool.configuredTool.id,
                'geometry_fk': this.geometry.id,
                'contributor_fk': this.contributorService.contributor == null ? -1: this.contributorService.contributor.id,
              })
            }
          }
        }
      }
      
      this.hyperdbService.postToolGeometryAssociations(associations)
      .subscribe(savedAssociations => {
        if (savedAssociations) {
          this.snackBar.open("Success", 'Dismiss', {
            duration: 1000
          })
        }
      })
    })
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