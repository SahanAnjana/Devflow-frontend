import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/_services/finance/expenses.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

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
    public dataService: DataService
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
