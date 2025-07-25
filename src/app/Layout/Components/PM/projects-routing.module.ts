import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { DevFlowComponent } from '../../Pages/dev-flow/dev-flow/dev-flow.component';
import { PmProjectsComponent } from './pm-projects/pm-projects.component';
import { TasksComponent } from './Tasks/tasks/tasks.component';
import { ResourcesComponent } from './resources/resources/resources.component';
import { IssuesComponent } from './Issues/issues/issues.component';
import { TestCasesComponent } from './TestCases/test-cases.component';
import { TimelineComponent } from './Timeline/timeline.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    children: [
      { path: '', component: PmDashboardComponent }, // default dashboard
      { path: 'projects', component: PmProjectsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'resources', component: ResourcesComponent },
      { path: 'issues', component: IssuesComponent },
      { path: 'testcases', component: TestCasesComponent },
      { path: 'timeline', component: TimelineComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
