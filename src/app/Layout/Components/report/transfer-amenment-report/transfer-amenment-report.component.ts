import { Component } from '@angular/core';
import { CommonsService } from 'src/app/_services/commons.service';

@Component({
  selector: 'app-transfer-amenment-report',
  templateUrl: './transfer-amenment-report.component.html',
  styleUrls: ['./transfer-amenment-report.component.sass']
})
export class TransferAmenmentReportComponent {
showDownloadButton = true;
  clientData:any;
  expand = false;
  summaryReportDetails = [];
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;
  totalRecords:any;
  constructor(
    private commonsService: CommonsService,
    // private reportsDataService: ReportsDataService,
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getUpdatedAgentTransactionDetails();
  }


  getUpdatedAgentTransactionDetails() {
    const data:any = {}
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    // this.reportsDataService.getUpdatedAgentTransactionDetails(data).subscribe((res:any) => {
    //   if (res['responseDto'] === null) {
    //     this.summaryReportDetails = [];
    //     this.totalRecords = 0;
    //   } else {
    //     this.summaryReportDetails = res['responseDto']['payload'];
    //     this.totalRecords = res['responseDto']['totalRecords'];
    //     console.log("summary detail",this.summaryReportDetails);
    //     console.log("resoon sumary", res['responseDto']);
    //   }

    // })
  }
  // getSummaryReportTransferAmenment(){
  //   this.reportsDataService.getSummaryReportTransferAmenment().subscribe(res=>{
  //   })
  // }

  pageIndexChange(selectedIndex:any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getUpdatedAgentTransactionDetails();
  }
}
