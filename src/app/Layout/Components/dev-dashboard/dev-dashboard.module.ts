import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevDashboardComponent } from './dev-dashboard.component';
import { DevDashboardRoutingModule } from './dev-dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [
    DevDashboardComponent,
    PermissionsComponent,
    ProfileComponent,
    SettingsComponent,
    UserManagementComponent,
  ],
  imports: [CommonModule, DevDashboardRoutingModule, SharedModule],
})
export class DevDashboardModule {}
