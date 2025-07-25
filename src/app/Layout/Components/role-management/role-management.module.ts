import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddNewRoleComponent } from './add-new-role/add-new-role.component';
import { CoreAdminPrivilagesComponent } from './core-admin-privilages/core-admin-privilages.component';


@NgModule({
  declarations: [
    RoleManagementComponent,
    AddNewRoleComponent,
    CoreAdminPrivilagesComponent
  ],
  imports: [
    CommonModule,
    RoleManagementRoutingModule,SharedModule
  ]
})
export class RoleManagementModule { }
