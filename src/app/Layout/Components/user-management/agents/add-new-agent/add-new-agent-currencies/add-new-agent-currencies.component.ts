import { Component } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';
import { SubAgentService } from 'src/app/_services/sub-agent.service';
import { UserManagementAgentService } from 'src/app/_services/user-management-agent.service';

@Component({
  selector: 'app-add-new-agent-currencies',
  templateUrl: './add-new-agent-currencies.component.html',
  styleUrls: ['./add-new-agent-currencies.component.sass'],
})
export class AddNewAgentCurrenciesComponent {
  currencyList: any[] = [];
  currencyRecList: any;
  currencySendingList: any;
  currencyNewList: any;
  currencyNewRecList: any;

  constructor(
    private makeTransferService: MakeTransferService,
    private agentService: AgentService,
    private dataService: DataService,
    private subagentService: SubAgentSettingsService,
    private userManagemant: UserManagementAgentService
  ) {}
  ngOnInit() {
    if (this.dataService.clickEventStatus == 'viewAgent') {
      this.getAllsendingcurrencies();
      this.getAllReceivingcurrencies();
    }

    this.getCurrency();
    // this.getAllsendingcurrencies();
    // this.getAllReceivingcurrencies();
  }
  getCurrency() {
    this.makeTransferService.getCurrency().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.currencyList = res['responseDto'];
        }
      },
    });
  }
  getAllsendingcurrencies() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.agentExposableId;
    this.userManagemant
      .getAllSignUpsendingcurrencies(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.currencySendingList = res['responseDto'];
          this.currencyNewList = this.currencySendingList.map(
            (currency: any) => currency.currencyId
          );
          this.agentService.sendingCurrencyList = this.currencyNewList;
        } else {
          this.currencySendingList = [];
        }
      });
  }
  getAllReceivingcurrencies() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.agentExposableId;
    this.subagentService
      .getAllSubAgentReceivingCurrency(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.currencyRecList = res['responseDto'];

          this.currencyNewRecList = this.currencyRecList.map(
            (currency: any) => currency.currencyId
          );
          this.agentService.receivingCurrencyList = this.currencyNewRecList;
        } else {
          this.currencyRecList = [];
        }
      });
  }
  getSendingCurrencies(event: any) {
    this.agentService.sendingCurrencyList = event;
  }

  getReceivingCurrencies(event: any) {
    this.agentService.receivingCurrencyList = event;
  }

  isCountrySendChecked(clientCurrencyId: number): boolean {
    return this.currencySendingList.some(
      (country: any) => country.clientCurrencyId === clientCurrencyId
    );
  }
  isCountryRecChecked(clientCurrencyId: number): boolean {
    return this.currencyRecList.some(
      (country: any) => country.clientCurrencyId === clientCurrencyId
    );
  }
}
