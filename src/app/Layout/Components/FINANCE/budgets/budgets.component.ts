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


}
