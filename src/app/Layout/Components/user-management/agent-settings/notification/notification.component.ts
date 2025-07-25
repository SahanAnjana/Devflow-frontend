import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AgentService } from 'src/app/_services/agent.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass'],
})
export class NotificationComponent implements OnInit {
  openingBal = 'Daily';
  closingBal = 'Daily';
  isClosingBalance = false;
  isOpeningBalance = false;
  isCreditAmount = false;
  agentNotificationConfigurationId: any;
  constructor(
    private agentService: AgentService,
    private dataService: DataService,
    private notificationService: NzNotificationService
  ) {}
  ngOnInit(): void {
    this.getAgentNotification();
  }
  getAgentNotification() {
    this.agentService
      .getAgentNotification(this.dataService.selectedData.agentDetailsId)
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.agentNotificationConfigurationId =
              res['responseDto'].agentNotificationConfigurationId;
            this.isOpeningBalance = res['responseDto'].isOpeningBalanceNotify;
            this.isClosingBalance = res['responseDto'].isClosingBalanceNotify;
            this.openingBal =
              res['responseDto']['openingBalanceNotifyPeriodDto'].period;
            this.closingBal =
              res['responseDto']['closingBalanceNotifyPeriodDto'].period;
            this.isCreditAmount =
              res['responseDto'].isCreditThresholdReachNotify;
          }
        },
      });
  }

  saveAgentNotification() {
    const data = {
      agentNotificationConfigurationId: this.agentNotificationConfigurationId
        ? this.agentNotificationConfigurationId
        : null,
      isOpeningBalanceNotify: this.isOpeningBalance,
      isClosingBalanceNotify: this.isClosingBalance,
      isCreditThresholdReachNotify: this.isCreditAmount,
      agentDetailsId: this.dataService.selectedData.agentDetailsId,
      closingBalanceNotifyPeriodDto: {
        period: this.closingBal,
      },
      openingBalanceNotifyPeriodDto: {
        period: this.openingBal,
      },
    };

    this.agentService.saveAgentNotification(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Notification Saved successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d' } }
          );
        }
      },
    });
  }
}
