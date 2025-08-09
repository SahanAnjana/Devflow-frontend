import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/_services/finance/accounts.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddAccountModalComponent } from './add-account-modal/add-account-modal.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass'],
})
export class AccountsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  accounts: any[] = [];
  total = 0;
  skip = 0;
  limit = 100;

  constructor(
    private accountsService: AccountsService,
    public dataService: DataService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      skip: this.skip,
      limit: this.limit,
    };

    this.accountsService.getALlAccounts(params).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.accounts = response.data;
          this.total = response.pagination?.totalItems || this.accounts.length;
        } else {
          this.accounts = [];
          this.total = 0;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load accounts.';
        this.loading = false;
      },
    });
  }

  addNewAccount(): void {
    const modal = this.modal.create({
      nzTitle: 'Add New Account',
      nzContent: AddAccountModalComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-account-modal',
    });

    modal.afterClose.subscribe((result) => {
      if (result && result.success) {
        // Reload accounts list after successful creation
        this.loadAccounts();
      }
    });
  }

  deleteAccount(account: any): void {
    this.modal.confirm({
      nzTitle: 'Confirm Delete',
      nzContent: `Are you sure you want to delete account "${account.name}"? This action cannot be undone.`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.performDelete(account.id);
      },
    });
  }

  private performDelete(accountId: any): void {
    this.loading = true;

    this.accountsService.deleteAccount(accountId).subscribe({
      next: (response: any) => {
        this.notification.create(
          'success',
          'Success',
          'Account deleted successfully',
          { nzStyle: { background: '#00A03E', color: '#fff' } }
        );
        // Reload the accounts list to reflect the deletion
        this.loadAccounts();
      },
      error: (err: any) => {
        this.loading = false;
        this.notification.create(
          'error',
          'Error',
          'Failed to delete account. Please try again.',
          { nzStyle: { background: '#ff4d4f', color: '#fff' } }
        );
      },
    });
  }
}
