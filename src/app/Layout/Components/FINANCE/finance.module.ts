import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceRoutingModule } from './finance-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { ExpencesComponent } from './expences/expences.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ReportComponent } from './report/report.component';
import { AddAccountModalComponent } from './accounts/add-account-modal/add-account-modal.component';
import { AddBudgetModalComponent } from './budgets/add-budget-modal/add-budget-modal.component';
import { AddExpenseModalComponent } from './expences/add-expense-modal/add-expense-modal.component';
import { AddInvoiceModalComponent } from './invoices/add-invoice-modal/add-invoice-modal.component';

@NgModule({
  declarations: [
    FinanceDashboardComponent,
    AccountsComponent,
    BudgetsComponent,
    ExpencesComponent,
    InvoicesComponent,
    ReportComponent,
    AddAccountModalComponent,
    AddBudgetModalComponent,
    AddExpenseModalComponent,
    AddInvoiceModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinanceRoutingModule,
    SharedModule,
  ],
})
export class FinanceModule {}
