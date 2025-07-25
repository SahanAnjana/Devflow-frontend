import { Component } from '@angular/core';
import { CommonsService } from 'src/app/_services/commons.service';
import format from 'date-fns/format';
import { ReportService } from 'src/app/_services/report.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
@Component({
  selector: 'app-cash-collection-report',
  templateUrl: './cash-collection-report.component.html',
  styleUrls: ['./cash-collection-report.component.sass'],
})
export class CashCollectionReportComponent {
  clientData: any;
  privilegeCodes: any;
  showDownloadButton = true;

  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;

  cashCollectionReportDetails = [];

  visibleDatePanel: any;
  visibleAgentExposableIdPanel: any;
  visibleTotalPayablePanel: any;

  filterByDateOn = false;
  filterByAgentExposableIdOn = false;
  filterByTotalPayableOn = false;

  dateRange = '';
  fromDate: any;
  toDate: any;
  fromTotalPayable = '';
  toTotalPayable = '';
  totalPayable1: any;
  totalPayable2: any;

  agentExposableId = '';
  items = null;
  agentExposableIdResult: any;
  agentExposableIds = [];
  agentName = '';

  totalRecords: any;

  cashcollection: any[] = [];
  agentname: any;
  tranferdata: any;
  totalPayable = '';
  transferDate: any;
  transferDate2: any;
  transferAmountStart: any;
  transferAmountEND: any;

  constructor(
    private commonsService: CommonsService,
    private report: ReportService,
    private notification: NzNotificationService,
    private dataService: DataService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
  }
  todayDate = new Date();
  ngOnInit() {
    this.getUserPrivilegeDetails();
    this.getAgentExposableIdData();
    this.getCashCollectionReportData();
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getCashCollectionReportData();
  }
  disabledFutureDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };
  resetFilterByDate() {
    this.visibleDatePanel = false;
    this.fromDate = '';
    this.toDate = '';
    this.dateRange = '';
    this.filterByDateOn = false;
    this.transferDate = '';
    this.transferDate2 = '';
    this.dataService.cashcommision.fromDate = '';
    this.dataService.cashcommision.toDate = '';
    this.getCashCollectionReportData();
  }

  resetFilterByresetFilterByAgentExposableId() {
    this.visibleAgentExposableIdPanel = false;
    this.filterByAgentExposableIdOn = false;
    this.agentExposableId = '';
    this.agentname = '';
    this.dataService.cashcommision.agentName = '';
    this.getCashCollectionReportData();
  }

  resetFilterByTotalPayablet() {
    this.visibleTotalPayablePanel = false;
    this.filterByTotalPayableOn = false;
    this.fromTotalPayable = '';
    this.toTotalPayable = '';
    this.totalPayable1 = '';
    this.totalPayable2 = '';
    this.transferAmountStart = '';
    this.transferAmountEND = '';
    this.dataService.cashcommision.endAmount = '';
    this.dataService.cashcommision.startAmount = '';
    this.getCashCollectionReportData();
  }

  getAgentExposableIdData() {
    // this.agentDataService.getAllAgentDetails().subscribe(res => {
    // this.agentExposableIds = res['responseDto'];
    // });
  }

  // this.reportsDataService.getCashCollectionReportData(data)
  // .subscribe((res:any) => {
  //   if (res['responseDto'] === null || res['responseDto']['payload'] === null) {
  //     this.cashCollectionReportDetails = [];
  //   } else {
  //     this.cashCollectionReportDetails = res['responseDto']['payload'];
  //   }

  // });

  getCashCollectionReportData() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['agentName'] = this.agentname;
    data['fromDate'] = this.fromDate ? format(this.fromDate, 'yyyy-MM-dd') : '';
    data['toDate'] = this.toDate ? format(this.toDate, 'yyyy-MM-dd') : '';
    data['startAmount'] = this.transferAmountStart;
    data['endAmount'] = this.transferAmountEND;
    this.dataService.cashcommision = data;
    this.report.getcashcollection(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.cashcollection = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
          // console.log('op', this.cashcollection);
          // this.transferlimitdetails = this.dataService.value;
        }
        // else {
        //   this.notification.createNotification(
        //     'error',
        //     '',
        //     '',
        //     res.errorDescription
        //   );
        // }
      },

      error: (err) => {},
    });
  }

  getUserPrivilegeDetails() {}

  downloadReport() {
    const data: any = {};
    data['pageNumber'] = 1;
    data['pageSize'] = 25;
    data['agentExposableId'] = this.agentExposableId;
    data['fromTotalPayable'] = this.fromTotalPayable;
    data['toTotalPayable'] = this.toTotalPayable;
    data['fromDate'] = this.fromDate;
    data['toDate'] = this.toDate;

    //  this.reportsDataService.downloadCashCollectionReportData(data).subscribe(res => {
    //     if (res) {
    //       console.log(res);
    //     }
    //   });
  }
}
