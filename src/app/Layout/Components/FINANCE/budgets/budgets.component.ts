import { Component, OnInit } from '@angular/core';
import { BudgetsService } from 'src/app/_services/finance/budgets.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddBudgetModalComponent } from './add-budget-modal/add-budget-modal.component';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.sass'],
})
export class BudgetsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  budgets: any[] = [];
  searchQuery = '';

  constructor(
    private budgetsService: BudgetsService,
    public dataService: DataService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    console.log('BudgetsComponent (FINANCE) initialized');
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.loading = true;
    this.error = null;

    console.log('Loading budgets without project filter...');

    // Remove the hardcoded project_id filter that was causing the empty results
    this.budgetsService.getAllBudgets({ skip: 0, limit: 100 }).subscribe({
      next: (response: any) => {
        console.log('Budget API response:', response);

        // Handle the API response structure properly
        if (response && response.success && response.data) {
          this.budgets = response.data;
          console.log('Budgets loaded successfully:', this.budgets);
        } else {
          console.warn(
            'No budgets found or invalid response structure:',
            response
          );
          this.budgets = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading budgets:', err);
        this.error = 'Failed to load budgets. Please try again later.';
        this.budgets = [];
        this.loading = false;
      },
    });
  }

  addNewBudget(): void {
    const modal = this.modal.create({
      nzTitle: 'Add New Budget',
      nzContent: AddBudgetModalComponent,
      nzFooter: null,
      nzWidth: 900,
      nzClassName: 'add-budget-modal',
    });

    modal.afterClose.subscribe((result) => {
      if (result && result.success) {
        // Reload budgets list after successful creation
        this.loadBudgets();
      }
    });
  }

  deleteBudget(budget: any): void {
    this.modal.confirm({
      nzTitle: 'Confirm Delete',
      nzContent: `Are you sure you want to delete budget "${budget.name}"? This action cannot be undone.`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.performDelete(budget.id);
      },
    });
  }

  private performDelete(budgetId: any): void {
    this.loading = true;

    this.budgetsService.deleteBudget(budgetId).subscribe({
      next: (response: any) => {
        this.notification.create(
          'success',
          'Success',
          'Budget deleted successfully',
          { nzStyle: { background: '#00A03E', color: '#fff' } }
        );
        // Reload the budgets list to reflect the deletion
        this.loadBudgets();
      },
      error: (err: any) => {
        this.loading = false;
        this.notification.create(
          'error',
          'Error',
          'Failed to delete budget. Please try again.',
          { nzStyle: { background: '#ff4d4f', color: '#fff' } }
        );
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  }
}
