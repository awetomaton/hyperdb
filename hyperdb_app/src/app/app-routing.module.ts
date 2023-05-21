import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './system/system.component';
import { GeometriesComponent } from './hyperdb/geometries/geometries.component';
import { GeometryComponent } from './hyperdb/geometry/geometry.component';
import { ContributorsComponent } from './hyperdb/contributors/contributors.component';
import { ContributorComponent } from './hyperdb/contributor/contributor.component';
import { ToolsComponent } from './tools/tools.component';
import { ToolComponent } from './tool/tool.component';
import { ToolVersionComponent } from './tool-version/tool-version.component';
import { ConfiguredToolComponent } from './hyperdb/configured-tool/configured-tool.component';
import { NewConfiguredToolComponent } from './hyperdb/new-configured-tool/new-configured-tool.component';
import { MeshComponent } from './hyperdb/mesh/mesh.component';
import { NewMeshComponent } from './hyperdb/new-mesh/new-mesh.component';
import { MeshToolResultsComponent } from './hyperdb/mesh-tool-results/mesh-tool-results.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'contributors', component: ContributorsComponent },
  { path: 'contributors/:id', component: ContributorComponent },
  { path: 'geometries', component: GeometriesComponent },
  { path: 'geometries/:id', component: GeometryComponent },
  { path: 'systems', component: SystemsComponent },
  { path: 'systems/:id', component: SystemComponent },
  { path: 'tools', component: ToolsComponent },
  { path: 'tools/:name', component: ToolComponent },
  { path: 'tools/:name/:version', component: ToolVersionComponent },
  { path: 'tools/:name/:version/configurations/new', component: NewConfiguredToolComponent },
  { path: 'tools/:name/:version/configurations/:id', component: ConfiguredToolComponent },
  { path: 'geometries/:id/meshes/new', component: NewMeshComponent },
  { path: 'meshes/:id', component: MeshComponent },
  { path: 'meshes/:mesh_id/tool-results/:configured_tool_id', component: MeshToolResultsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
