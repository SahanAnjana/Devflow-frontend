import { Component } from '@angular/core';
import { CommonsService } from 'src/app/_services/commons.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass'],
})
export class OverviewComponent {
  currentUser: any;
  transactionCountData: any;
  usersCount: any;

  constructor(
    private dashBoard: DashboardService,
    private commonsService: CommonsService,
    private tokenService: TokenserviceService,
    private report: ReportService,
    private dataService: DataService
  ) {
    this.currentUser = this.commonsService.parseJwt(tokenService.getToken());
  }

  ngOnInit() {
    this.getTransactionCountNotification();
    this.getUsersCount();
    this.getExposableId();
  }

  getExposableId() {
    const data: any = {};
    data['username'] = this.currentUser.sub;
    this.report
      .getAgentDetailsGetExposableId(data)

      .subscribe({
        next: (res) => {
          if (res['responseDto'] != null) {
            this.dataService.exposableIdMonex = res['responseDto']['data'];
          }
        },
      });
  }

  getTransactionCountNotification() {
    const data: any = {};
    data['userName'] = this.currentUser.sub;
    data['clientCode'] = 'MN';
    this.dashBoard.getTransactionCount(data).subscribe({
      next: (res) => {
        this.transactionCountData = res['responseDto'];
      },
    });
  }

  getUsersCount() {
    this.dashBoard.getUserCount().subscribe({
      next: (res) => {
        this.usersCount = res['responseDto'];
      },
    });
  }
}
