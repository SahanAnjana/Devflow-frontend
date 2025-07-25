import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/_services/finance/expenses.service';

@Component({
  selector: 'app-expences',
  templateUrl: './expences.component.html',
  styleUrls: ['./expences.component.sass']
})
export class ExpencesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  expences: any[] = [];

  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading = true;
    this.error = null;

    this.expensesService.getAllExpenses({ skip: 0, limit: 100, project_id: 'axx' }).subscribe({
      next: (data: any) => {
        this.expences = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading expenses:', err);
        this.error = 'Failed to load expenses. Please try again later.';
        this.loading = false;
      }
    });
  }
}
