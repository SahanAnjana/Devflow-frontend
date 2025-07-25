import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { PmProjectsComponent } from './pm-projects/pm-projects.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { TasksComponent } from './Tasks/tasks/tasks.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { MembersTabComponent } from './view-project/members-tab/members-tab.component';
import { AddMemberRoleComponent } from './view-project/members-tab/add-member-role/add-member-role.component';
import { SettingComponent } from './view-project/setting/setting.component';
import { AddNewTaskComponent } from './Tasks/add-new-task/add-new-task.component';
import { ResourcesComponent } from './resources/resources/resources.component';
import { AddNewResourcesComponent } from './resources/add-new-resources/add-new-resources.component';
import { IssuesComponent } from './Issues/issues/issues.component';
import { AddNewIssuesComponent } from './Issues/add-new-issues/add-new-issues.component';
import { TestCasesComponent } from './TestCases/test-cases.component';
import { AddNewTestCaseComponent } from './TestCases/add-new-test-case/add-new-test-case.component';
import { TimelineComponent } from './Timeline/timeline.component';

@NgModule({
  declarations: [
    PmDashboardComponent,
    PmProjectsComponent,
    ViewProjectComponent,
    TasksComponent,
    EditProjectComponent,
    MembersTabComponent,
    AddMemberRoleComponent,
    SettingComponent,
    TimelineComponent,
    AddNewTaskComponent,
    ResourcesComponent,
    AddNewResourcesComponent,
    IssuesComponent,
    AddNewIssuesComponent,
    TestCasesComponent,
    AddNewTestCaseComponent,
  ],
  imports: [CommonModule, ProjectsRoutingModule, SharedModule],
})
export class ProjectsModule {}
