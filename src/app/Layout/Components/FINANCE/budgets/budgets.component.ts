import { Component, OnInit } from '@angular/core';
import { BudgetsService } from 'src/app/_services/finance/budgets.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

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
    public dataService: DataService
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
