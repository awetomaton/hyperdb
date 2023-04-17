import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './system/system.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'systems', component: SystemsComponent },
  { path: 'systems/:id', component: SystemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
