import { Component } from '@angular/core';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-view-agent-customer-transaction-modal',
  templateUrl: './view-agent-customer-transaction-modal.component.html',
  styleUrls: ['./view-agent-customer-transaction-modal.component.sass'],
})
export class ViewAgentCustomerTransactionModalComponent {
  pageSize = 10;
  currentPageIndex = 1;
  pageNumber = 1;
  totalRecords: any;
  summary: any[] = [];
  dateFormat = 'yyyy/MM/dd';

  tableData: any[] = [];

  constructor(
    private dataService: DataService,
    private agentCustomerService: AgentCustomerService
  ) {}

  ngOnInit() {
    if (this.dataService.agentCustomerTransactionData) {
      this.getTransactionsDetails(
        this.dataService.agentCustomerTransactionData
      );
      this.getCustomerVolumeReportSummary(
        this.dataService.agentCustomerTransactionData
      );
    }
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getTransactionsDetails(this.dataService.agentCustomerTransactionData);
  }
  getTransactionsDetails(receviedData: any) {
    const data: any = {};

    data['userName'] = receviedData.email;

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['transactionSummery'] = 'transaction summery';
    this.agentCustomerService.getTransactionSummary(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.summary = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
        }
      },
    });
    // this.agentTransactionDataService.getFillterSearchByDateAndReference(data).subscribe((res:any) => {
    //   if (res['responseDto'] === null) {
    //     this.transactions = [];
    //     this.totalRecords = 0;
    //   } else if (res['responseDto']['payload'] === null) {
    //     this.transactions = [];
    //     this.totalRecords = 0;
    //   } else {
    //     this.transactions = res['responseDto']['payload'];
    //     this.totalRecords = res['responseDto']['totalRecords'];
    //     //this.dataService.totalTransaction = this.totalRecords;
    //   }
    // });
  }

  getCustomerVolumeReportSummary(receviedData: any) {
    console.log('receviedData', receviedData);

    const data = {
      id: receviedData.agentSenderDetailsid,
      sendingCurrencyCode: 'GBP',
    };
    this.agentCustomerService.getVolumeSummary(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.tableData = res['responseDto'];
        }
      },
    });
  }
}
