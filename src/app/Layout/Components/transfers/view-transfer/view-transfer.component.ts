import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-view-transfer',
  templateUrl: './view-transfer.component.html',
  styleUrls: ['./view-transfer.component.sass'],
})
export class ViewTransferComponent {
  @Input() mode: any = {};

  // @ViewChild(ViewTransferComponent)
  // viewTransferComponent!: ViewTransferComponent;
  @ViewChild(BeneficiaryDetailsComponent, { static: false })
  viewBeneficiary!: BeneficiaryDetailsComponent;
  step = 1;
  isButtonEnable = true;
  currentStepIndex = 0;
  currentStepStatus1 = 'process';
  currentStepStatus2 = 'wait';
  currentStepStatus3 = 'wait';
  currentStepStatus4 = 'wait';

  public customerTransferFollowForm!: FormGroup;

  getAllTransferFlowData: any;

  public unsubscribe$ = new Subject<void>();
  isBeneficiaryEditable: any;
  isBeneficiaryBankEditable: any;

  constructor(
    private fb: FormBuilder,
    private diagnosticService: DiagnosticService,
    private dataservice: DataService,
    private transferservice: TransferTabService,
    private transferService: MakeTransferService,
    private modalref: NzModalRef
  ) {}

  ngOnInit() {
    const {
      customRequired,
      maxLength,
      minLength,
      email,
      pattern,
      alphanumericWithSpaces,
      fourLettersSevenAlphanumeric,
    } = MyValidators;
    this.customerTransferFollowForm = this.fb.group({
      viewTransferGroup: this.fb.group({
        amountTobeSent: [null, null],
        transferAs: [null, null],
        recipientCurrency: [null, null],
        sendingCurrency: [null, null],
        beneficiarywillReceive: [null, null],
        totalAmountPayable: [null, null],
      }),
      userDetailsGroup: this.fb.group({
        firstName: [null, null],
        lastName: [null, null],
        TelephoneLand: [null, null],
        TelephoneMobile: [null, null],
        email: [null, null],
        residentialAddress: [null, null],
        city: [null, null],
        status: [null, null],
        Nationality: [null, null],
        Payingby: [null, null],
        PostalCode: [null, null],
      }),
      beneficiaryDetailsGroup: this.fb.group({
        firstName: [null, null],
        lastName: [null, null],
        dob: [null, null],
        placeofbirth: [null, null],
        nationality: [null, null],
        Code: [null, null],
        code: [null, null],
        CompanyName: [null, null],
        MobileNumber: [null, null],
        contactNumber: [null, null],
        address: [null, null],
        country: [null, null],
        bankName: [null, null],
        accountNumber: [null, null],
        bankBranch: [null, null],
        Currency: [null, null],
        bankCode: [null, null],
        ifsc: [null, null],
        iban: [null, null],
        branchCode: [null, null],
        Swiftcode: [null, null],
        buttonPersonalBeneficiary: [null, null],
        routingnumber: [null, null],
      }),
      // viewTransferInvoiceGroup: this.fb.group({}),
    });

    // this.getTransferFlowDetails();
    // this.getPatchValue();
    this.checkBeneficiary();
    this.checkBeneficiaryBank();
    this.getBeneficiaryDetailsById();
  }
  updatebeneficiary() {
    if (this.viewBeneficiary) {
      this.viewBeneficiary.updateUser();
    }
  }
  getFormControlValue1(name: string) {
    return (
      this.customerTransferFollowForm.controls['viewTransferGroup'] as FormGroup
    ).controls[`${name}`]?.value;
  }
  getFormControlValue2(name: string) {
    return (
      this.customerTransferFollowForm.controls['userDetailsGroup'] as FormGroup
    ).controls[`${name}`]?.value;
  }

  getFormControlValue3(name: string) {
    return (
      this.customerTransferFollowForm.controls[
        'beneficiaryDetailsGroup'
      ] as FormGroup
    ).controls[`${name}`]?.value;
  }

  getPatchValue() {
    this.customerTransferFollowForm.get('viewTransferGroup')?.patchValue({
      amountTobeSent: this.getAllTransferFlowData.sendAmount,
      transferAs: this.getAllTransferFlowData.transactionMode,
      recipientCurrency: this.getAllTransferFlowData.recipientCurrency,
      sendingCurrency: this.getAllTransferFlowData.sendingCurrency,
      beneficiarywillReceive: this.getAllTransferFlowData.amountReceived,
      totalAmountPayable: this.getAllTransferFlowData.totalAmountPayable,
    });

    this.customerTransferFollowForm.get('userDetailsGroup')?.patchValue({
      firstName: this.getAllTransferFlowData.senderFirstName,
      lastName: this.getAllTransferFlowData.senderLastName,
      TelephoneLand: this.getAllTransferFlowData.senderTelephone,
      TelephoneMobile: this.getAllTransferFlowData.senderMobile,
      email: this.getAllTransferFlowData.senderEmailAddress,
      residentialAddress: this.getAllTransferFlowData.residentialAddress,
    });

    this.customerTransferFollowForm.get('beneficiaryDetailsGroup')?.patchValue({
      firstNamebeni: this.getAllTransferFlowData.senderFirstName,
      lastNamebeni: this.getAllTransferFlowData.senderLastName,
      contactNumber: this.getAllTransferFlowData.contactNumber,
      address: this.getAllTransferFlowData.address,
      dateOfBirth: this.getAllTransferFlowData.date,
      bankName: this.getAllTransferFlowData.bank,
      accountNumber: this.getAllTransferFlowData.accountNumber,
      bankBranch: this.getAllTransferFlowData.residentialAddress,
    });
  }

  // getTransferFlowDetails() {
  //   const data: any = {};
  //   data['trasferFlowId'] = this.mode.transferFlowId;
  //   this.diagnosticService
  //     .getAllTransferFlowStepById(data)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((res: any) => {
  //       if (res['responseDto']) {
  //         this.getAllTransferFlowData = res['responseDto'];
  //         this.getPatchValue();
  //       }
  //     });
  // }

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
    this.modalref.destroy();
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
  checkBeneficiary() {
    const data: any = {};
    data['beneficiaryDetailsId'] =
      this.dataservice.transferdata.agentBeneficiaryDetailsId;
    this.transferservice
      .checkIsBeneficiaryEditable(data)
      .subscribe((res: any) => {
        this.isBeneficiaryEditable = res['responseDto'];
        this.dataservice.isBenEditable = this.isBeneficiaryEditable;
      });
  }
  checkBeneficiaryBank() {
    const data: any = {};
    data['beneficiaryDetailsId'] =
      this.dataservice.transferdata.agentBeneficiaryDetailsId; //  change here agent beneficiary id
    data['agentBeneficiaryBankAccountDetailsId'] =
      this.dataservice.transferdata.beneficiaryBankDetailsId; // change here beneficiary bankdetailsId
    this.transferservice.chcekBankEditable(data).subscribe((res: any) => {
      this.isBeneficiaryBankEditable = res['responseDto'];
      this.dataservice.isBankEditabled = this.isBeneficiaryBankEditable;
    });
  }

  getBeneficiaryDetailsById() {
    const data: any = {};
    data['agentBeneficiaryDetailsId'] =
      this.dataservice.transferdata.agentBeneficiaryDetailsId;
    return this.transferService
      .getBeneficiaryDetailsById(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.dataservice.beneficiaryViewData = res['responseDto'];
        } else {
          this.dataservice.beneficiaryViewData = null;
        }
      });
  }
}
