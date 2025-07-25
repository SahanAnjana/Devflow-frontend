import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Layout/Pages/login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { ForgetComponent } from './Layout/Pages/forgot-password/forgot-password.component';
import { ResetpasswordComponent } from './Layout/Pages/resetpassword/resetpassword.component';
import { DevFlowComponent } from './Layout/Pages/dev-flow/dev-flow/dev-flow.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgetComponent,
  },
  {
    path: 'reset-password',
    component: ResetpasswordComponent,
    // canActivate: [ResetpasswordGuard],
  },
  {
    path: '',
    component: DevFlowComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'devflow',
        pathMatch: 'full',
      },
      {
        path: 'devflow',
        loadChildren: () =>
          import('./Layout/Components/dev-dashboard/dev-dashboard.module').then(
            (m) => m.DevDashboardModule
          ),
        data: { title: 'devflow' },
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./Layout/Components/PM/projects.module').then(
            (m) => m.ProjectsModule
          ),
        data: { title: 'projects' },
      },
      {
        path: 'hr',
        loadChildren: () =>
          import('./Layout/Components/HR/hr.module').then((m) => m.HrModule),
        data: { title: 'HR' },
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./Layout/Components/FINANCE/finance.module').then(
            (m) => m.FinanceModule
          ),
        data: { title: 'finance' },
      },
      {
        path: 'crm',
        loadChildren: () =>
          import('./Layout/Components/CRM/crm.module').then((m) => m.CrmModule),
        data: { title: 'finance' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
