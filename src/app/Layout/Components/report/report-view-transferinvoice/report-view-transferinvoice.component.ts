import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-report-view-transferinvoice',
  templateUrl: './report-view-transferinvoice.component.html',
  styleUrls: ['./report-view-transferinvoice.component.sass'],
})
export class ReportViewTransferinvoiceComponent {
  details: any;
  constructor(
    private formBuilder: FormBuilder,
    private report: ReportService,

    private dataService: DataService
  ) {}

  ngOnInit() {
    this.details = this.dataService.reportdata;
    // console.log('output', this.details);
  }
  // getDetailById(receivedData: any) {
  //   const data: any = {};
  //   data['agentTransactionDetailId'] = receivedData;

  //   this.report.getdetailsofreport(data).subscribe({
  //     next: (res) => {
  //       if (res['responseDto']) {
  //         this.tableData(res['responseDto']);
  //       }
  //       console.log('output', this.editDetails);
  //     },
  //   });
  // }
  // getDetailById() {
  //   const data: any = {};
  //   data['agentTransactionDetailId'] = 1294;

  //   this.report.getdetailsofreport(data).subscribe((res: any) => {
  //     this.details = res['responseDto'];
  //   });
  //   console.log('output', this.details);

  // }
}
