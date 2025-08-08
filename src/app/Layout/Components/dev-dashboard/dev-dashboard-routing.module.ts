import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevDashboardComponent } from './dev-dashboard.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UserManagementComponent } from './user-management/user-management.component';

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
      { path: 'user-management', component: UserManagementComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevDashboardRoutingModule {}

// Add child routes here as needed
