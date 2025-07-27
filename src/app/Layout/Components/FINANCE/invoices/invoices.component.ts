import { Component, OnInit } from '@angular/core';
import { InvoicesService } from 'src/app/_services/finance/invoices.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass'],
})
export class InvoicesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  invoices: any[] = [];
  total = 0;
  skip = 0;
  limit = 100;

  constructor(
    private invoicesService: InvoicesService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      skip: this.skip,
      limit: this.limit,
    };

    this.invoicesService.getAllInvoices(params).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.invoices = response.data;
          this.total = response.pagination?.totalItems || this.invoices.length;
        } else {
          this.invoices = [];
          this.total = 0;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading invoices:', err);
        this.error = 'Failed to load invoices. Please try again later.';
        this.loading = false;
      },
    });
  }
}
