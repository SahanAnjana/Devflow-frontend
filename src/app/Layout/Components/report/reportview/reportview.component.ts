import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportViewBeneficiarydetailsComponent } from '../report-view-beneficiarydetails/report-view-beneficiarydetails.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-reportview',
  templateUrl: './reportview.component.html',
  styleUrls: ['./reportview.component.sass'],
})
export class ReportviewComponent {
  @ViewChild(ReportViewBeneficiarydetailsComponent, { static: false })
  viewBeneficiary!: ReportViewBeneficiarydetailsComponent;
  step = 1;
  isButtonEnable = true;
  currentStepIndex = 0;
  currentStepStatus1 = 'process';
  currentStepStatus2 = 'wait';
  currentStepStatus3 = 'wait';
  currentStepStatus4 = 'wait';

  customerTransferFollowForm!: FormGroup;
  bankData: any;
  isBeneficiaryEditable: any;
  isBeneficiaryBankEditable: any;
  benifisaryeUpdate = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notification: NzNotificationService,
    private commonsService: CommonsService,
    private nzModalservice: NzModalService,
    private report: ReportService,
    private modalRef: NzModalRef
  ) {}
  ngOnInit() {
    this.checkBeneficiary();
    this.checkBeneficiaryBank();
    // if (
    //   this.dataService.isBenEditable.isEditable === true &&
    //   this.dataService.isBankEditable.isEditable === true
    // ) {
    //   this.benifisaryeUpdate = true;
    //   console.log('beni update true');
    // } else {
    //   console.log('beni update false');
    // }
  }
  next() {
    if (this.step < 6) this.step++;
    this.currentStepIndex++;

    // Step changing logic
    if (this.step === 1) {
      this.currentStepStatus2 = 'wait';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
    } else if (this.step === 2) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
    } else if (this.step === 3) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'wait';
    } else {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'process';
    }
  }

  prev() {
    if (this.step > 1) this.step--;
    this.currentStepIndex--;

    // Step changing logic
    if (this.step === 1) {
      this.currentStepStatus2 = 'wait';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
    } else if (this.step === 2) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
    } else if (this.step === 3) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'wait';
    } else {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'process';
    }
  }

  close() {
    this.modalRef.close();
  }

  Confirmation() {
    if (this.step < 6) this.step++;
    this.currentStepIndex++;
    this.isButtonEnable = false;
    this.currentStepStatus1 = 'process';
    this.currentStepStatus2 = 'process';
    this.currentStepStatus3 = 'process';
    this.currentStepStatus4 = 'process';
  }
  updatebeneficiary() {
    // Call the function in the ReportViewBeneficiarydetailsComponent
    if (this.viewBeneficiary) {
      this.viewBeneficiary.updateUser(); // FunctionName in ReportViewBeneficiarydetailsComponent
    }
  }
  // getBankAccount() {
  //   const data: any = {};
  //   data['agentTransactionDetailId'] = 1295;
  //   //this.dataService.reportdata.agentTransactionDetailId;
  //   this.report.getbankDetails(data).subscribe((res: any) => {
  //     this.bankData = res['responseDto'];
  //     this.dataService.bankData = this.bankData;
  //     console.log(this.bankData);
  //   });
  // }
  checkBeneficiary() {
    const data: any = {};
    data['beneficiaryDetailsId'] =
      this.dataService.reportdata.agentBeneficiaryDetailsId;
    this.report.checkBeneficiaryEditable(data).subscribe((res: any) => {
      this.isBeneficiaryEditable = res['responseDto'];
      this.dataService.isBenEditable = this.isBeneficiaryEditable;
    });
  }
  checkBeneficiaryBank() {
    const data: any = {};
    data['beneficiaryDetailsId'] =
      this.dataService.reportdata.agentBeneficiaryDetailsId; //  change here agent beneficiary id
    data['agentBeneficiaryBankAccountDetailsId'] =
      this.dataService.reportdata.beneficiaryBankAccountDetailId; // change here beneficiary bankdetailsId
    this.report.checkBankdetailsEditable(data).subscribe((res: any) => {
      this.isBeneficiaryBankEditable = res['responseDto'];
      this.dataService.isBankEditable = this.isBeneficiaryBankEditable;
      console.log('is editabl', this.dataService.isBankEditable.isEditable1);
    });
  }
}
