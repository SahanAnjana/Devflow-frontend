import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevDashboardComponent } from './dev-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DevDashboardComponent,
    children: [
      {
        path: '',
        component: DevDashboardComponent, // This will show the dashboard main view
      },
      // Add more child routes here if needed, e.g.:
      // { path: 'workflow', component: WorkflowComponent },
      // { path: 'project', component: ProjectComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevDashboardRoutingModule {}

// Add child routes here as needed
