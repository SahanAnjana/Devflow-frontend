import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Layout/Pages/dashboard/dashboard.component';
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
      {
        path: 'report',
        loadChildren: () =>
          import('./Layout/Components/report/report.module').then(
            (m) => m.ReportModule
          ),
        data: { title: 'Report' },
      },
      {
        path: 'make-transfer',
        loadChildren: () =>
          import('./Layout/Components/make-transfer/make-transfer.module').then(
            (m) => m.MakeTransferModule
          ),
        data: { title: 'Make Transfer' },
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import(
            './Layout/Components/user-management/user-management.module'
          ).then((m) => m.UserManagementModule),
        data: { title: 'User Management' },
      },
      {
        path: 'role-management',
        loadChildren: () =>
          import(
            './Layout/Components/role-management/role-management.module'
          ).then((m) => m.RoleManagementModule),
        data: { title: 'Role Management' },
      },
      {
        path: 'transfers',
        loadChildren: () =>
          import('./Layout/Components/transfers/transfers.module').then(
            (m) => m.TransfersModule
          ),
        data: { title: 'Transfers' },
      },
      {
        path: 'Communication',
        loadChildren: () =>
          import('./Layout/Components/communication/communication.module').then(
            (m) => m.CommunicationModule
          ),
        data: { title: 'Communication' },
      },
      {
        path: 'Diagnostic',
        loadChildren: () =>
          import('./Layout/Components/diagnostic/diagnostic.module').then(
            (m) => m.DiagnosticModule
          ),
        data: { title: 'Diagnostic' },
      },
      {
        path: 'promotion',
        loadChildren: () =>
          import('./Layout/Components/promotion/promotion.module').then(
            (m) => m.PromotionModule
          ),
        data: { title: 'Promotion' },
      },
      {
        path: 'pending-cash-collection',
        loadChildren: () =>
          import(
            './Layout/Components/pending-cash-collection/pending-cash-collection.module'
          ).then((m) => m.PendingCashCollectionModule),
        data: { title: 'Pending Cash Collection' },
      },
      {
        path: 'transfer-limit',
        loadChildren: () =>
          import(
            './Layout/Components/transfer-limit/transfer-limit.module'
          ).then((m) => m.TransferLimitModule),
        data: { title: 'Transfer Limit' },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./Layout/Components/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
        data: { title: 'Settings' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
