import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './system/system.component';
import { GeometriesComponent } from './geometries/geometries.component';
import { GeometryComponent } from './geometry/geometry.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { ContributorComponent } from './contributor/contributor.component';
import { ToolsComponent } from './tools/tools.component';
import { ToolComponent } from './tool/tool.component';
import { ToolVersionComponent } from './tool-version/tool-version.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
