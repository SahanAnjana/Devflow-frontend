import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from 'src/app/_services/agent.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-agent-approved-currencies',
  templateUrl: './agent-approved-currencies.component.html',
  styleUrls: ['./agent-approved-currencies.component.sass'],
})
export class AgentApprovedCurrenciesComponent implements OnInit {
  switchValue = false;
  checked = true;
  currencyList: any[] = [];
  sendingCurrency: any;
  tableData: any[] = [];
  recievingCurrencyList: any[] = [];
  selectedCurrencyList: any[] = [];
  pageSize: any = 5;
  pageNumber: any = 1;
  totalRecords: any;
  currentPageIndex = 1;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private makeTransferService: MakeTransferService,
    private dataService: DataService,
    private metaService: MetaService,
    private notification: NzNotificationService,
    private agentService: AgentService,
    private eventTrigger: EventtriggerService
  ) {}
  ngOnInit(): void {
    this.getAgentSendingCurrencies();
    this.getReceivingCurrencies();
    this.getAllAgentSendingReceivingCurrency();
  }

  getAgentSendingCurrencies() {
    const data = {
      exposableId: this.dataService.selectedData.exposableId,
    };
    this.makeTransferService.getAgentSendingCurrency(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.currencyList = res['responseDto'];
        }
      },
    });
  }
  getReceivingCurrencies() {
    this.metaService
      .getAllAgentReceivingCurrencies(this.dataService.selectedData.exposableId)
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.recievingCurrencyList = res['responseDto'];
          }
        },
      });
  }
  getSelectedReceivingCurrencyList(event: any) {
    this.selectedCurrencyList = event;
  }

  update() {
    console.log('update works');

    if (!this.sendingCurrency) {
      this.createNotifications(
        'Error',
        'Sending Currency cannot be empty',
        '#F45300',
        'Error'
      );
      return;
    }
    if (this.selectedCurrencyList.length == 0) {
      this.createNotifications(
        'Error',
        ' Recieving Currency cannot be empty',
        '#F45300',
        'Error'
      );
      return;
    }
    const data = {
      agentTransferApprovedSendingCurrenciesId: this.sendingCurrency,
      agentTransferApprovedRecievingCurrenciesIdList: this.selectedCurrencyList,
      agentExposableId: this.dataService.selectedData.exposableId,
    };
    this.agentService
      .saveAgentSendingReceivingCurrency(
        data,
        this.dataService.selectedData.exposableId
      )
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.createNotifications(
              'success',
              'Curencies Updated Successfully',
              '#F45300',
              'Success'
            );
            this.cancel();
            this.getAllAgentSendingReceivingCurrency();
            this.eventTrigger.onReloadServiceData('currency');
          } else {
            this.createNotifications(
              'Error',
              res['errorDescription'],
              '#F45300',
              'Error'
            );
          }
        },
      });
  }
  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    // console.log('createNotification');
    // title: string, message: string
    this.notification.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }
  cancel() {
    this.sendingCurrency = null;
    this.getReceivingCurrencies();
  }

  getAllAgentSendingReceivingCurrency() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['exposableId'] = this.dataService.selectedData.exposableId;
    this.metaService
      .agentSendingReceivingCurrency(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableData = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.tableData = [];
            this.totalRecords = 0;
          }
        },
        error: (e: any) => {
          this.tableData = [];
        },
      });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllAgentSendingReceivingCurrency();
  }

  updateStatus(receivedData: any) {
    const data = {
      isActive: !receivedData.isActive,
      agentTransferApprovedSendingReceivingCurrenciesId:
        receivedData.agentTransferApprovedSendingReceivingCurrenciesId,
    };
    this.agentService.updateAgentSendingCurrencyStatusUpdate(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.createNotifications(
            'success',
            'Status Updated Successfully',
            '#F45300',
            'Success'
          );
          this.getAllAgentSendingReceivingCurrency();
        } else {
          this.createNotifications(
            'Error',
            res['errorDescription'],
            '#F45300',
            'Error'
          );
        }
      },
    });
  }
}
