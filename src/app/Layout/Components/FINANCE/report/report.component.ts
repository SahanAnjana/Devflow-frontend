import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
})
export class ReportComponent implements OnInit {
  loading = false;
  error: string | null = null;
  reports: any[] = [];

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;

    // Placeholder for reports data - to be implemented when reports API is available
    setTimeout(() => {
      this.reports = [
        {
          id: 1,
          title: 'Monthly Financial Report',
          type: 'Financial',
          date: '2024-01-01',
          status: 'Completed',
        },
        {
          id: 2,
          title: 'Budget Analysis Report',
          type: 'Budget',
          date: '2024-01-15',
          status: 'In Progress',
        },
        {
          id: 3,
          title: 'Expense Report Q1',
          type: 'Expense',
          date: '2024-03-31',
          status: 'Completed',
        },
      ];
      this.loading = false;
    }, 1000);
  }
}
