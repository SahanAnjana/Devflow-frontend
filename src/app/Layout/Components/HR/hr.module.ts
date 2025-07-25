import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HrRoutingModule } from './hr-routing.module';

import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { DepartmentComponent } from './department/department.component';
import { PositionsComponent } from './positions/positions.component';
import { LeavesComponent } from './leaves/leaves.component';
import { PerformanceComponent } from './performance/performance.component';
import { AddNewEmployeeComponent } from './employees/add-new-employee/add-new-employee.component';
import { ViewEmployeeComponent } from './employees/view-employee/view-employee.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AddNewDepartmentComponent } from './department/add-new-department/add-new-department.component';
import { AddNewPositionComponent } from './positions/add-new-position/add-new-position.component';
import { AddNewLeaveComponent } from './leaves/add-new-leave/add-new-leave.component';
import { AddNewPerformanceComponent } from './performance/add-new-performance/add-new-performance.component';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { JobApplicatonsComponent } from './job-applicatons/job-applicatons.component';
import { AddNewJobpostComponent } from './job-posting/add-new-jobpost/add-new-jobpost.component';
import { InterviewComponent } from './interview/interview.component';

@NgModule({
  declarations: [
    HrDashboardComponent,
    EmployeesComponent,
    DepartmentComponent,
    PositionsComponent,
    LeavesComponent,
    PerformanceComponent,
    AddNewEmployeeComponent,
    ViewEmployeeComponent,
    AddNewDepartmentComponent,
    AddNewPositionComponent,
    AddNewLeaveComponent,
    AddNewPerformanceComponent,
    JobPostingComponent,
    JobApplicatonsComponent,
    AddNewJobpostComponent,
    InterviewComponent,
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzSelectModule,
  ],
  exports: [SharedModule],
})
export class HrModule {}
