import { Component } from '@angular/core';
import { CommonsService } from 'src/app/_services/commons.service';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-sub-agent-commission-report',
  templateUrl: './sub-agent-commission-report.component.html',
  styleUrls: ['./sub-agent-commission-report.component.sass'],
})
export class SubAgentCommissionReportComponent {
  agentExposableId: any;
  visibleAgentExposableIdPanel: any;
  filterByAgentExposableIdOn = false;
  agentExposableIdResult: any;
  agentData: any;
  summaryReportDetails: any;
  showDownloadButton = true;
  totalRecords: any;
  pageSize = 10;
  currentPageIndex = 1;
  pageNumber = 1;
  clientData: any;

  reportdetails: any;
  totalRecord: any;
  constructor(
    // private reportsDataService: ReportsDataService,
    // private agentDataService: AgentDataService,
    private commonsService: CommonsService,
    private report: ReportService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getAgentExposableIdData();
  }

  getAgentExposableIdData() {
    // this.agentDataService.getAllAgentDetails().subscribe((res:any) => {
    //   if (res['responseDto']) {
    //     this.agentData = res['responseDto'];
    //     this.agentExposableId = res['responseDto'][0]['agentExposableId'];
    //     this.getSubAgentCommissionReport();
    //   }
    // });
  }

  filterByAgentExposableId() {
    this.visibleAgentExposableIdPanel = false;
    this.filterByAgentExposableIdOn = true;

    if (this.agentExposableIdResult !== undefined) {
      this.agentExposableId = this.agentExposableIdResult['agentExposableId'];
      this.getSubAgentCommissionReport();
    }
  }

  getSubAgentCommissionReport() {
    const data = {
      agentExposableId: this.agentExposableId,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    // this.reportsDataService.getSubAgentCommissionReport(data).subscribe((res:any) => {
    //   if (res['responseDto']) {
    //     this.summaryReportDetails = res['responseDto']['payload'];
    //     this.totalRecords = res['responseDto']['totalRecords']
    //   } else {
    //     this.summaryReportDetails = [];
    //     this.totalRecords = 0;
    //   }
    // })
  }

  downloadSubAgentCommissionReport() {
    const data = {
      userName: this.clientData.sub,
      agentExposableId: this.agentExposableId,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    // this.reportsDataService.downloadSubAgentCommissionReport(data).subscribe((res:any) => {

    // })
  }
  getreportdetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.report.getreportdetails(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.reportdetails = res['responseDto']['payload']['NoticeWork'][0];
          this.totalRecord = res['responseDto']['totalRecords'];
          // this.transferlimitdetails = this.dataService.value;
        } else {
          this.reportdetails = [];
          this.totalRecord = 0;
        }
      },

      error: (err) => {},
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getSubAgentCommissionReport();
  }

  resetFilterByresetFilterByAgentExposableId() {
    this.visibleAgentExposableIdPanel = false;
    this.filterByAgentExposableIdOn = false;
    this.agentExposableId = '';
    this.getSubAgentCommissionReport();
  }
}
