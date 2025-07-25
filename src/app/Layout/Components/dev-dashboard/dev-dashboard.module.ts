import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevDashboardComponent } from './dev-dashboard.component';
import { DevDashboardRoutingModule } from './dev-dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';

@NgModule({
  declarations: [DevDashboardComponent],
  imports: [CommonModule, DevDashboardRoutingModule, SharedModule],
})
export class DevDashboardModule {}
