import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/_services/finance/expenses.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddExpenseModalComponent } from './add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-expences',
  templateUrl: './expences.component.html',
  styleUrls: ['./expences.component.sass'],
})
export class ExpencesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  expences: any[] = [];
  total = 0;
  skip = 0;
  limit = 100;

  constructor(
    private expensesService: ExpensesService,
    public dataService: DataService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      skip: this.skip,
      limit: this.limit,
    };

    this.expensesService.getAllExpenses(params).subscribe({
      next: (response: any) => {
        console.log('Expenses API Response:', response);
        if (response && response.data) {
          this.expences = response.data;
          this.total = response.pagination?.totalItems || this.expences.length;
        } else {
          this.expences = [];
          this.total = 0;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading expenses:', err);
        this.error = 'Failed to load expenses. Please try again later.';
        this.loading = false;
      },
    });
  }

  refreshExpenses(): void {
    this.skip = 0;
    this.loadExpenses();
  }

  addNewExpense(): void {
    const modal = this.modal.create({
      nzTitle: 'Add New Expense',
      nzContent: AddExpenseModalComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-expense-modal',
    });

    modal.afterClose.subscribe((result) => {
      if (result && result.success) {
        // Reload expenses list after successful creation
        this.loadExpenses();
      }
    });
  }

  deleteExpense(expense: any): void {
    this.modal.confirm({
      nzTitle: 'Confirm Delete',
      nzContent: `Are you sure you want to delete this expense "${expense.description}"? This action cannot be undone.`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.performDelete(expense.id);
      },
    });
  }

  private performDelete(expenseId: any): void {
    this.loading = true;

    this.expensesService.deleteExpense(expenseId).subscribe({
      next: (response: any) => {
        this.notification.create(
          'success',
          'Success',
          'Expense deleted successfully',
          { nzStyle: { background: '#00A03E', color: '#fff' } }
        );
        // Reload the expenses list to reflect the deletion
        this.loadExpenses();
      },
      error: (err: any) => {
        this.loading = false;
        this.notification.create(
          'error',
          'Error',
          'Failed to delete expense. Please try again.',
          { nzStyle: { background: '#ff4d4f', color: '#fff' } }
        );
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  }
}
