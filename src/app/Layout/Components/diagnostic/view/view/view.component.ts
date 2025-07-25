import { Component, Input, NgModuleRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';
import { ViewTransferComponent } from '../view-transfer/view-transfer.component';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent {
  @Input() mode: any = {};

  @ViewChild(ViewTransferComponent)
  viewTransferComponent!: ViewTransferComponent;

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

  constructor(
    private fb: FormBuilder,
    private diagnosticService: DiagnosticService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit() {
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
      }),
      beneficiaryDetailsGroup: this.fb.group({
        firstNamebeni: [null, null],
        lastNamebeni: [null, null],
        contactNumber: [null, null],
        address: [null, null],
        dateOfBirth: [null, null],
        bankName: [null, null],
        accountNumber: [null, null],
        bankBranch: [null, null],
      }),
      // viewTransferInvoiceGroup: this.fb.group({}),
    });
    this.customerTransferFollowForm.disable();
    this.getTransferFlowDetails();
    // this.getPatchValue();
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

  getTransferFlowDetails() {
    const data: any = {};
    data['trasferFlowId'] = this.mode.transferFlowId;
    this.diagnosticService
      .getAllTransferFlowStepById(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.getAllTransferFlowData = res['responseDto'];
          this.getPatchValue();
        }
      });
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
}
