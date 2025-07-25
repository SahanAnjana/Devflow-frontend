import { Component, OnInit } from '@angular/core';
import { InvoicesService } from 'src/app/_services/finance/invoices.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  invoices: any[] = [];

  constructor(private invoicesService: InvoicesService) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.error = null;

    this.invoicesService.getAllInvoices({ skip: 0, limit: 100, project_id: 'axx' }).subscribe({
      next: (data: any) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading invoices:', err);
        this.error = 'Failed to load invoices. Please try again later.';
        this.loading = false;
      }
    });
  }
}
