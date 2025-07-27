import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceRoutingModule } from './finance-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { ExpencesComponent } from './expences/expences.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [
    FinanceDashboardComponent,
    AccountsComponent,
    BudgetsComponent,
    ExpencesComponent,
    InvoicesComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FinanceRoutingModule,
    SharedModule
  ],
})
export class FinanceModule { }
