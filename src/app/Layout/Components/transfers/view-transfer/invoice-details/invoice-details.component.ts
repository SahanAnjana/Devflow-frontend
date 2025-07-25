import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.sass']
})
export class InvoiceDetailsComponent {
  @Input() getAllTransferFlowData: any = {};

  // tableData: any = {};

  // sendername: any;
  // transferdAmout: any;
  // benificaryName: any;
  // transferAs: any;
  // amountRecived: any;
  details: any;
  constructor(
    private formBuilder: FormBuilder,
    private report: ReportService,

    private dataService: DataService
  ) {}

  ngOnInit() {
    this.details = this.dataService.transferdata;
    console.log('output', this.details);
  }

  // tableData = [
  //   {
  //     date: '2023.06.17',
  //     senderName: 'Nimal',
  //     beniName: 'Ajith',
  //     transferAs: 'Bank deposite',
  //     transferedAmount: '1,000.00',
  //     receivedAmount: '1,000.00',
  //   },
  // ];

  // constructor(private diagnosticService: DiagnosticService) {}

  // ngOnInit() {
  //   this.tableData = this.getAllTransferFlowData;
  //   this.sendername =
  //     this.getAllTransferFlowData.senderFirstName +
  //     this.getAllTransferFlowData.senderLastName;
  //   this.transferdAmout = this.getAllTransferFlowData.sendAmount;
  //   this.benificaryName = this.getAllTransferFlowData.beneficiaryFullName;
  //   this.transferAs = this.getAllTransferFlowData.transactionMode;
  //   this.amountRecived = this.getAllTransferFlowData.amountReceived;
  // }
}
