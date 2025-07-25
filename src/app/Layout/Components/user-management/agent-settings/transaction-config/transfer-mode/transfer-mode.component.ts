import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';

@Component({
  selector: 'app-transfer-mode',
  templateUrl: './transfer-mode.component.html',
  styleUrls: ['./transfer-mode.component.sass'],
})
export class TransferModeComponent {
  tableData: any = [];
  pageSize: any = 5;
  pageNumber: any = 1;
  totalRecords: any = 0;
  currentPageIndex = 1;
  exposableId: any;
  recievingCurrencyList: any[] = [];
  currency_data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currency: any;
  constructor(
    private modalService: NzModalService,
    private router: Router,
    private subAgentSetting: SubAgentSettingsService,
    private metaService: MetaService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private eventTrigger: EventtriggerService
  ) {}

  ngOnInit(): void {
    this.getAllReceivingCurrency();
    this.getAllTransferMode();
    this.getReceivingCurrencies();
  }

  getAllReceivingCurrency() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;
    console.log('subReceCurr', this.dataService.subAgent);
    this.subAgentSetting
      .getAllSubAgentReceivingCurrency(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.currency_data = res['responseDto'];
          console.log('subCurrency', this.currency_data);
        },
      });
  }

  getAllTransferMode() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;
    data['isUnique'] = true;
    data['agentTransferApprovedReceivingCurrenciesId'] = this.currency;

    this.subAgentSetting
      .getSubAgentTransferMode(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableData = res['responseDto'];
            this.totalRecords = res['responseDto']['totalRecords'];

            console.log('SubTransferMode', this.tableData);
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

  changeRoleStatus(values: any) {
    const data: any = {};
    data['isActive'] = !values.isActive;
    data['agentCurrencyTransactionModeId'] =
      values.agentCurrencyTransactionModeId;

    this.subAgentSetting.updateSubAgentTransferModeStatus(data).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Status Updated Successfully',
            '#F45300',
            'Success'
          );
          this.getAllTransferMode();
          this.eventTrigger.onReloadServiceData('transaction');
        } else {
          this.createNotifications(
            'Error',
            'Status Updating Failed',
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
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllTransferMode();
  }
}
