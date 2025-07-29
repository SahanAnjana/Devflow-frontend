import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevDashboardComponent } from './dev-dashboard.component';
import { PermissionsComponent } from './permissions/permissions.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    children: [
      { path: '', component: DevDashboardComponent },
      { path: 'permissions', component: PermissionsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevDashboardRoutingModule {}

// Add child routes here as needed
