import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.sass'],
})
export class PaymentModeComponent {
  tableData: any = [];
  pageSize: any = 5;
  pageNumber: any = 1;
  totalRecords: any;
  currentPageIndex = 1;
  exposableId: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private subAgentSetting: SubAgentSettingsService,
    private metaService: MetaService,
    private dataService: DataService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getAllPaymentMode();
    console.log('ng on init');
  }
  getExposableId(email: any) {
    const data: any = {};
    data['username'] = email;
    this.metaService
      .getAgentDetailsGetExposableId(data)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.exposableId = res['responseDto']['data'];
          this.getAllPaymentMode();
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  getAllPaymentMode() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;

    this.subAgentSetting
      .getSubAgentPaymentMode(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableData = res['responseDto'];
            this.totalRecords = res['responseDto']['totalRecords'];

            console.log('SuuPaymentMode', this.tableData);
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

  changeRoleStatus(values: any) {
    // const data: any = {}; need to send data service and retirive user id
    // data['email'] = this.dataService.subAgent.email;
    const data: any = {};
    data['isActive'] = !values.isActive;
    data['agentPaymentModeId'] = values.agentPaymentModeId;

    this.subAgentSetting.updateSubAgentPaymentModeStatus(data).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Role Status Updated Successfully',
            '#F45300',
            'Success'
          );
          this.getAllPaymentMode();
        } else {
          this.createNotifications(
            'Error',
            'Role Status Updating Failed',
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
}
