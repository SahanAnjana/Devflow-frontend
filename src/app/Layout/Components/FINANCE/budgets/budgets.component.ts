import { Component, OnInit } from '@angular/core';
import { BudgetsService } from 'src/app/_services/finance/budgets.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.sass']
})
export class BudgetsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  budgets: any[] = [];
  searchQuery = '';

  constructor(private budgetsService: BudgetsService) { }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.loading = true;
    this.error = null;

    this.budgetsService.getAllBudgets({ skip: 0, limit: 100, project_id: 'axx' }).subscribe({
      next: (data: any) => {
        this.budgets = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading budgets:', err);
        this.error = 'Failed to load budgets. Please try again later.';
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'orange';
      case 'completed': return 'blue';
      default: return 'default';
    }
  }

  onSearch(): void {
    // Implement search functionality if needed
    // You can filter the budgets array or make a new API call with search parameters
  }

  onAddBudget(): void {
    // Implement add budget functionality
    // This should open a modal or navigate to a form
  }

  onEditBudget(budget: any): void {
    // Implement edit functionality
    // This should open a modal or navigate to a form with the budget data
  }

  onDeleteBudget(budgetId: string): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetsService.deleteBudget(budgetId).subscribe({
        next: () => {
          // Remove the deleted budget from the list
          this.budgets = this.budgets.filter(b => b.id !== budgetId);
        },
        error: (err: any) => {
          console.error('Error deleting budget:', err);
          this.error = 'Failed to delete budget. Please try again.';
        }
      });
    }
  }
}
