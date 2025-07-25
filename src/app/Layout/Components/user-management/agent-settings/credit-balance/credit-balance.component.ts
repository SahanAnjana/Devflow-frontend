import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AgentService } from 'src/app/_services/agent.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-credit-balance',
  templateUrl: './credit-balance.component.html',
  styleUrls: ['./credit-balance.component.sass'],
})
export class CreditBalanceComponent {
  status = false;
  statusView = false;
  constructor(
    private dataService: DataService,
    private agentService: AgentService,
    private notificationService: NzNotificationService
  ) {}
  ngOnInit() {
    this.status = this.dataService.selectedData.isCreditBalanceStatus;
    this.statusView = this.status;
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
  changeStatus(status: any) {
    const data: any = {};
    this.statusView = status;
    data['isCreditBalanceRequired'] = !this.status;
    data['exposableId'] = this.dataService.selectedData.exposableId;

    this.agentService.updateCreditBalanceStatus(data).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Status Updated Successfully',
            '#F45300',
            'Success'
          );
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
}
