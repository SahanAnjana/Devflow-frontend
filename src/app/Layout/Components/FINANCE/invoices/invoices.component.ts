import { Component, OnInit } from '@angular/core';
import { InvoicesService } from 'src/app/_services/finance/invoices.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddInvoiceModalComponent } from './add-invoice-modal/add-invoice-modal.component';

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
    public dataService: DataService,
    private modal: NzModalService,
    private notification: NzNotificationService
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

  refreshInvoices(): void {
    this.loadInvoices();
  }

  addNewInvoice(): void {
    const modal = this.modal.create({
      nzTitle: '',
      nzContent: AddInvoiceModalComponent,
      nzFooter: null,
      nzBodyStyle: { padding: '0px' },
      nzWidth: '600px',
    });

    modal.afterClose.subscribe((result) => {
      if (result === 'success') {
        this.loadInvoices();
      }
    });
  }

  deleteInvoice(invoice: any): void {
    this.modal.confirm({
      nzTitle: 'Delete Invoice',
      nzContent: `Are you sure you want to delete the invoice "${invoice.name}"?`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => this.performDelete(invoice.id),
    });
  }

  performDelete(invoiceId: string): void {
    this.invoicesService.deleteInvoice(invoiceId).subscribe({
      next: (response: any) => {
        this.notification.success('Success', 'Invoice deleted successfully');
        this.loadInvoices();
      },
      error: (err: any) => {
        console.error('Error deleting invoice:', err);
        this.notification.error(
          'Error',
          'Failed to delete invoice. Please try again.'
        );
      },
    });
  }
}
