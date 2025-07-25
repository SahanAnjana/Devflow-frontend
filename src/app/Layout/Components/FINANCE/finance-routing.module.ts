import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { ExpencesComponent } from './expences/expences.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    children: [
      { path: '', component: FinanceDashboardComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'expenses', component: ExpencesComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'reports', component: ReportComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
