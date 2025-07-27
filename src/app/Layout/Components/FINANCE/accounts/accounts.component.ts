import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/_services/finance/accounts.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

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
    public dataService: DataService
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
}
