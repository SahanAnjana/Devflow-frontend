import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { DepartmentComponent } from './department/department.component';
import { PositionsComponent } from './positions/positions.component';
import { LeavesComponent } from './leaves/leaves.component';
import { PerformanceComponent } from './performance/performance.component';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { JobApplicatonsComponent } from './job-applicatons/job-applicatons.component';
import { InterviewComponent } from './interview/interview.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    children: [
      { path: '', component: HrDashboardComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'departments', component: DepartmentComponent },
      { path: 'positions', component: PositionsComponent },
      { path: 'leaves', component: LeavesComponent },
      { path: 'performance', component: PerformanceComponent },
      { path: 'jobposting', component: JobPostingComponent },
      { path: 'jobapplication', component: JobApplicatonsComponent },
      { path: 'interview', component: InterviewComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
