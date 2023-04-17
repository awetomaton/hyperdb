import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './system/system.component';
import { GeometriesComponent } from './geometries/geometries.component';
import { GeometryComponent } from './geometry/geometry.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'geometries', component: GeometriesComponent },
  { path: 'geometries/:id', component: GeometryComponent },
  { path: 'systems', component: SystemsComponent },
  { path: 'systems/:id', component: SystemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
