import { Component } from '@angular/core';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.sass'],
})
export class ConfirmationComponent {
  constructor(private dataservice: DataService) {}
  beneficiary: any;
  sendingAmount: any;
  receivingAmount: any;
  transferAs: any;
  sender: any;
  ngOnInit() {
    this.beneficiary =
      this.dataservice.beneficiaryData.beneficiaryFirstName +
      ' ' +
      (this.dataservice.beneficiaryData.beneficiaryLastName
        ? this.dataservice.beneficiaryData.beneficiaryLastName
        : '');
    // this.sendingAmount = this.dataservice.sendingAmount;
    this.sendingAmount = this.dataservice.totalamount?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.receivingAmount = this.dataservice.receivingAmount;
    this.transferAs = this.dataservice.transferAs.transactionModeDesc;
    this.sender = this.dataservice.senderData.fullName;
    console.log(this.dataservice.beneficiaryData);
    console.log(this.dataservice.sendingAmount);
    console.log(this.dataservice.receivingAmount);
    console.log(this.dataservice.transferAs);
    console.log('total amount', this.dataservice.totalamount);
    console.log(
      'total amount 2',
      this.dataservice.totalamount?.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  currentDate: Date = new Date();
}
