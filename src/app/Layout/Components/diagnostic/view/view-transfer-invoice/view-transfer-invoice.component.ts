import { Component, Input } from '@angular/core';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';

@Component({
  selector: 'app-view-transfer-invoice',
  templateUrl: './view-transfer-invoice.component.html',
  styleUrls: ['./view-transfer-invoice.component.sass'],
})
export class ViewTransferInvoiceComponent {
  @Input() getAllTransferFlowData: any = {};

  tableData: any = {};

  sendername: any;
  transferdAmout: any;
  benificaryName: any;
  transferAs: any;
  amountRecived: any;

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

  constructor(private diagnosticService: DiagnosticService) {}

  ngOnInit() {
    this.tableData = this.getAllTransferFlowData;
    this.sendername =
      this.getAllTransferFlowData.senderFirstName +
      this.getAllTransferFlowData.senderLastName;
    this.transferdAmout = this.getAllTransferFlowData.sendAmount;
    this.benificaryName = this.getAllTransferFlowData.beneficiaryFirstName + this.getAllTransferFlowData.beneficiaryLastName ;
    this.transferAs = this.getAllTransferFlowData.transactionMode;
    this.amountRecived = this.getAllTransferFlowData.amountReceived;
  }
}
