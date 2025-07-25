import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/_services/finance/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private accountsService: AccountsService) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountsService.getALlAccounts({ skip: 0, limit: 100, project_id: 'axx' }).subscribe({
      next: (data: any) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load accounts.';
        this.loading = false;
      }
    });
  }
}
