import { Component } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { ReportService } from 'src/app/_services/report.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
})
export class ReportComponent {
  privileges: any = {
    CORE_SHOW_REPORTS_DOWNLOAD_BUTTON: false,
  };

  selectedOption = 'Summary Report';
  selectedReportType: any;
  pageNumber = 1;
  pageSize = 20;
  clientData: any;
  reportPrivilage: any = [];
  allPrivilages: any;

  constructor(
    private report: ReportService,
    private commonservice: CommonsService,
    private dataService: DataService,
    private eventriggerservice: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.clientData = this.commonservice.parseJwt(this.tokenService.getToken());
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.eventriggerservice.onReloadServiceData('privilage');
    this.reportPrivilage;

    if (!this.selectedReportType) {
      this.selectedReportType = 'Summary Report';
    }

    this.eventriggerservice.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_REPORTS_DOWNLOAD_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_REPORTS_DOWNLOAD_BUTTON = true)
          : false;
      }
    });
  }

  changeReportType(receivedData: any) {
    this.selectedReportType = receivedData;
  }
  // downloadExcelReport() {
  //   if (!this.isEmptyResults_Report) {
  //     const data: any = {};
  //     data['username'] = 'spotontestcustomer@gmail.com';
  //     data['pageNumber'] = 1;
  //     data['pageSize'] = 20;
  //     data['date'] = this.dealDateReport;

  //     this.reportDataService.getSummaryReport(data).subscribe((res) => {});
  //   } else {
  //     this.notificationService.createNotificationWarning(
  //       'warning',
  //       'No Data Found',
  //       '#FFFF',
  //       'No Data'
  //     );
  //   }
  // }
  downloadReport() {
    // console.log(this.dataService.summaryReport);

    const data: any = {};
    data['userName'] = this.clientData.sub;
    data['clientName'] = this.dataService.summaryReport.clientName;
    data['fromDate'] = this.dataService.summaryReport.fromDate;
    data['toDate'] = this.dataService.summaryReport.toDate;
    data['agentName'] = this.dataService.summaryReport.agentName;
    data['startAmount'] = this.dataService.summaryReport.startAmount;
    data['endAmount'] = this.dataService.summaryReport.endAmount;
    data['userType'] = this.dataService.summaryReport.userType;
    data['transferStatus'] = this.dataService.summaryReport.transferStatus;
    data['transferAs'] = this.dataService.summaryReport.transferAs;
    data['transactionRef'] = this.dataService.summaryReport.transactionRef;
    data['customerRef'] = this.dataService.summaryReport.customerRef;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['country'] = this.dataService.summaryReport.country;
    data['currency'] = this.dataService.summaryReport.currency;

    // data['currencyId'] = this.currencyId ? this.currencyId : '';
    this.report.downloadSummaryReport(data).subscribe((res) => {
      if (res) {
        // console.log(res);
      }
    });
  }
  downloadcashcommision() {
    // console.log(this.dataService.cashcommision);

    const data: any = {};

    data['agentExposableId'] = 'JVb3mfaNS29';

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = 25;
    data['agentName'] = this.dataService.cashcommision.agentName;
    data['endAmount'] = this.dataService.cashcommision.endAmount;
    data['startAmount'] = this.dataService.cashcommision.startAmount;
    data['fromDate'] = this.dataService.cashcommision.fromDate;
    data['toDate'] = this.dataService.cashcommision.toDate;

    // data['currencyId'] = this.currencyId ? this.currencyId : '';
    this.report.downloadcashcommision(data).subscribe((res) => {
      if (res) {
        // console.log(res);
      }
    });
  }
  downloadcommisionfee() {
    const data: any = {};
    data['userName'] = this.clientData.sub;

    data['agentExposableId'] = 'JVb3mfaNS29';

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = 2;

    // data['currencyId'] = this.currencyId ? this.currencyId : '';
    this.report.downloadcommisionfee(data).subscribe((res) => {
      if (res) {
        // console.log(res);
      }
    });
  }
  downloadTransferAmenment() {
    // data['currencyId'] = this.currencyId ? this.currencyId : '';
    this.report.downloadtransfer().subscribe((res) => {
      if (res) {
        // console.log(res);
      }
    });
  }
}
