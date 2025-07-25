import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { format } from 'date-fns';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransferDetailsComponent } from '../transfer-details/transfer-details.component';
import { SenderDetailsComponent } from '../sender-details/sender-details.component';
import { BeneficiaryDetailsComponent } from '../beneficiary-details/beneficiary-details.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MyValidators } from 'src/app/validators/custom-validators';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NonNullAssert } from '@angular/compiler';
import { Subject, takeUntil } from 'rxjs';
import { ReportService } from 'src/app/_services/report.service';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DecimalPipe } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-make-transfer',
  templateUrl: './make-transfer.component.html',
  styleUrls: ['./make-transfer.component.sass'],
})
export class MakeTransferComponent {
  @ViewChild(TransferDetailsComponent, { static: false })
  transferDetails!: TransferDetailsComponent;
  @ViewChild(SenderDetailsComponent, { static: false })
  senderDetails!: SenderDetailsComponent;
  @ViewChild(BeneficiaryDetailsComponent, { static: false })
  beneficiaryDetails!: BeneficiaryDetailsComponent;
  @ViewChild(ConfirmationComponent, { static: false })
  confirmation!: ConfirmationComponent;
  step = 1;
  index = 0;
  maketransferForm!: FormGroup;
  makeTransfrFlow3!: FormGroup;
  makeTransfrFlow2!: FormGroup;
  makeTransfrFlow1!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  allAgents: any;
  agentId: any;
  agentEmail: any;
  affiliateAgents: any;
  subAgents: any;
  exposableId: any;
  agentSendingCurrency: any;
  transactionMode: any;
  paymentModedata: any;
  receivingCurrencyId: any;
  sendingCurrencyCode: any;
  agentReceivingCurrency: any;
  countryData: any;
  referenceData: any;
  bankCurrencyList: any;
  deviceInfo: any;

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private transferService: MakeTransferService,
    private dataservice: DataService,
    private reportService: ReportService,
    private eventTriggerService: EventtriggerService,
    private decimalPipe: DecimalPipe,
    private deviceInfoService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.deviceInfo = this.deviceInfoService.getDeviceInfo();
    // this.getCurrencyForBank();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'nextStep') {
          this.step++;
          this.index++;
        }
      },
    });

    const {
      customRequired,
      customConfirmPasswordRequired,
      maxLength,
      minLength,
      customEmail,
      customRequiredno,
      contactNumberLength,
      phonenumValidator,
      customRequiredNumber,
      fourLettersSevenAlphanumeric,
      alphanumericWithSpaces,
    } = CustomValidators;
    this.maketransferForm = this.fb.group({
      makeTransfrFlow3: this.fb.group({
        country: [null, Validators.required],
        searchBeneficiary: [null],
        firstName: [null, Validators.required],
        companyName: [null, Validators.required],
        lastName: [null, Validators.required],
        code: [null, Validators.required],
        code2: [null, Validators.required],
        telephoneNumber: [
          null,
          [minLength(9), maxLength(10), customRequiredno('Telephone Number')],
        ],
        mobileNumber: [
          null,
          [customRequiredno('Mobile Number'), minLength(9), maxLength(10)],
        ],
        residentalAddress: [null, Validators.required],
        dob: [null, Validators.required],
        placeOfBirth: [null, Validators.required],
        nationality: [null, Validators.required],
        reference: [null, Validators.required],
        referenceOther: [null, null],
        bankName: [null, Validators.required],
        accName: [
          null,
          [Validators.compose([Validators.required, maxLength(30)])],
        ],
        branchName: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.alphanumericWithSpaces(5, 35),
          ]),
        ],
        bankCode: [null, null],
        supportCurrency: [null, Validators.required],
        routingNumber: [null, null],
        swiftCode: [null, null],
        buttonPersonalBeneficiary: [null, null],
        label4: [null, null],
        label5: [null, null],
        label6: [null, null],
      }),

      makeTransfrFlow2: this.fb.group({
        searchSender: [null],
        filterBy: [null],
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        codePhone: [null, Validators.required],
        codeMobile: [null, Validators.required],
        landLineNumber: [
          null,
          [customRequiredno('Contact Number'), maxLength(15)],
        ],
        mobileNumber: [
          null,
          [customRequiredno('Contact Number'), maxLength(15)],
        ],
        email: [null, Validators.required],
        residentalAddress: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        country: [null, Validators.required],
        nationality: [null, null],
        postalCode: [null, Validators.required],
        idType: [null, Validators.required],
        idNumber: [null, Validators.required],
        idexpireDate: [null, Validators.required],
      }),
      makeTransfrFlow1: this.fb.group({
        agentName: [null, Validators.required],
        subAgentName: [null],
        affiliateName: [null],
        sendingCurrency: [null, Validators.required],
        recipientCurrency: [null, Validators.required],
        sendingAmount: [null, Validators.required],
        receivingAmount: [null, Validators.required],
        paymentMode: [null, Validators.required],
        transferMode: [null, Validators.required],
        rate: [null],
        transferFeeMethod: [null],
        transactionFee: [null],
        totalAmount: [null],
        senderSearch: [null, Validators.required],
        senderSearchType: [1],
      }),
    });
    this.getAgent();
    // this.getAllSignUpCountries();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'close') {
          this.dataservice.beneficiaryData = null;
          this.dataservice.beneficiaryId = null;
          this.dataservice.senderData = null;
          this.dataservice.agentSenderDetailsId = null;
          this.dataservice.selectedBankId = null;
          this.dataservice.agentId = null;
          this.dataservice.selectBankAccount = null;
        }
      },
    });
  }

  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
  savebeneficiary() {
    if (this.beneficiaryDetails.mySwitchValue == true) {
      this.beneficiaryDetails.saveNewCoporateBeneficiary();
    } else {
      this.beneficiaryDetails.saveNewPersonalBeneficiary();
    }
  }
  // getCurrencyForBank() {
  //   return this.transferService.getCurrency().subscribe((res: any) => {
  //     if (res['responseDto']) {
  //       this.bankCurrencyList = res['responseDto'];
  //     }
  //   });
  // }
  getCurrencyForBank(exposableId: any) {
    const data: any = {};
    data['exposableId'] = exposableId;
    return this.transferService
      .getAgentReceivingCurrency(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.bankCurrencyList = res['responseDto'];
        }
      });
  }

  clearBEnifisaryDetails() {
    this.getFormControlValue(3, 'country').reset();
    this.getFormControlValue(3, 'searchBeneficiary').reset();
    this.getFormControlValue(3, 'companyName').reset();
    this.getFormControlValue(3, 'code').reset();
    this.getFormControlValue(3, 'telephoneNumber').reset();
  }
  next() {
    if (!this.maketransferForm.controls[`makeTransfrFlow${this.step}`].valid) {
      this.validateform(this.step);
      return;
    }
    if (this.step === 1) {
      this.transferDetails.finalValidation();
      if (
        this.dataservice.validationResult == true &&
        parseFloat(
          this.getFormControlValue(1, 'totalAmount').replace(/,/g, '')
        ) > 0
      ) {
        this.getAllSignUpCountries();
        this.transferDetails.checkRatesValidOrNot();
        // this.step++;
        // this.index++;
      } else if (this.dataservice.validationResult == false) {
        this.createNotification(
          'error',
          'Input Error',
          'Transaction validation Failed',
          '#ffffff',
          '#cc2d2d'
        );
      } else if (this.getFormControlValue(1, 'totalAmount') <= 0) {
        this.createNotification(
          'error',
          'Input Error',
          'Total Payable Can not be 0',
          '#ffffff',
          '#cc2d2d'
        );
      }
      // this.step++;
      // this.index++;
    } else if (this.step === 2) {
      if (this.senderDetails.isSenderNotAvailable == true) {
        this.saveSender();
      } else if (this.dataservice.senderData == null) {
        this.createNotification(
          'error',
          'Input Error',
          'Please Select Sender',
          '#ffffff',
          '#cc2d2d'
        );
      } else if (this.senderDetails.isSenderNotAvailable == false) {
        this.senderDetails.validateExpDate();
        if (this.senderDetails.isFuture == false) {
          this.createNotification(
            'error',
            'Input Error',
            'Sender Id Expired',
            '#ffffff',
            '#cc2d2d'
          );
        } else {
          if (this.dataservice.senderData.agentSenderIdentityId != null) {
            this.updateSenderIdData();
          } else {
            this.updateSenderNewIdData();
          }
          this.step++;
          this.index++;
        }
      }

      // this.step++;
      // this.index++;
    } else if (this.step === 3) {
      // Add condition for step 2
      // console.log('bank', this.beneficiaryDetails.selectedAccountDetails);
      // console.log(
      //   "  this.getFormControlValue(1, 'transferMode').value",
      //   this.getFormControlValue(1, 'transferMode')
      // );

      if (this.beneficiaryDetails.isNewBeneficiary == false) {
        this.savebeneficiary();
      } else if (this.beneficiaryDetails.isNewBank == true) {
        this.beneficiaryDetails.saveNewBankDetails();
      } else if (
        this.beneficiaryDetails.selectedAccountDetails == null &&
        this.getFormControlValue(1, 'transferMode').transactionModeDesc !==
          'Cash Pickup'
      ) {
        this.createNotification(
          'error',
          'Input Error',
          'Please Select A Bank Account',
          '#ffffff',
          '#cc2d2d'
        );
      } else {
        this.saveFirstStep();
        this.step++;
        this.index++;
      }
    } else if (this.step === 4) {
      this.step++;
      this.index++;
    }
  }

  prev() {
    if (this.step > 1) {
      this.step--;
      this.index--;
    }
    // this.clearFormGroup(this.maketransferForm);
  }
  clearFormGroup(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.setValue(null); // Or set to an empty string control.setValue('');
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        // Recursively clear values for nested form groups or form arrays
        this.clearFormGroup(control);
      }
    });
  }
  close() {
    console.log('close working');
    this.step = 1;
    this.index = 0;
    this.dataservice.senderData = null;
    this.clearFormGroup(this.maketransferForm);
    this.eventTriggerService.onReloadServiceData('close');
    this.dataservice.beneficiaryId = null;
    this.dataservice.selectedBank = null;
    window.location.reload();
    console.log('close working 2');
  }

  getFormControlValue(index: number, name: string) {
    return (
      this.maketransferForm.controls[`makeTransfrFlow${index}`] as FormGroup
    ).controls[`${name}`]?.value;
  }

  Confirmation() {
    // console.log('form1', this.getFormControlValue(1, 'agentName'));
    // console.log('form2', this.getFormControlValue(2, 'firstName'));
    // console.log('form3', this.getFormControlValue(3, 'firstName'));
  }

  checkValidity() {
    if (this.transferDetails) {
      this.transferDetails.finalValidation();
    }
  }
  saveSender() {
    if (this.senderDetails) {
      if (this.senderDetails.isSenderNotAvailable == true) {
        this.senderDetails.saveSender();
      }
    }
  }
  validateform(index: any) {
    const controls = (
      this.maketransferForm.controls[`makeTransfrFlow${index}`] as FormGroup
    ).controls;

    Object.values(controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty(); // Optionally mark control as dirty if needed
        // Optionally update the validity of the control if needed
        // control.updateValueAndValidity({ onlySelf: true });

        // Notify user of validation error
        const controlName = Object.keys(controls).find(
          (key) => controls[key] === control
        );
        // const errorMessage = `${controlName} cannot be empty`;
        const fieldName = this.getFieldName(controlName);
        // console.log(errorMessage);
        this.createNotification(
          'error',
          'Input Error',
          fieldName + ' Cannot be empty',
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'agentName': {
        return 'Agent Name';
      }
      case 'sendingCurrency': {
        return 'Sending Currency';
      }
      case 'recipientCurrency': {
        return 'Receipient Currency';
      }
      case 'sendingAmount': {
        return 'Sending Amount';
      }
      case 'receivingAmount': {
        return 'Receiving Amount';
      }
      case 'paymentMode': {
        return 'Payment Mode';
      }
      case 'transferMode': {
        return 'Transfer Mode';
      }
      //--------------------------------------//
      case 'senderSearch': {
        return 'Sender';
      }
      case 'firstName': {
        return 'First Name';
      }
      case 'lastName': {
        return 'Last Name';
      }
      case 'landLineNumber': {
        return 'Landline Number';
      }
      case 'mobileNumber': {
        return 'Mobile Number';
      }
      case 'email': {
        return 'Email';
      }
      case 'residentalAddress': {
        return 'Residental Address';
      }
      case 'idType': {
        return 'Id Type';
      }
      case 'idNumber': {
        return 'Id Number';
      }
      case 'idexpireDate': {
        return 'Id Expiry Date';
      }
      case 'state': {
        return 'State';
      }
      //-------------------------------------//
      case 'country': {
        return 'Country';
      }
      case 'nationality': {
        return 'Nationality';
      }
      case 'dob': {
        return 'Date Of Birth';
      }
      case 'placeOfBirth': {
        return 'Place of Birth';
      }
      case 'firstName': {
        return 'First Name';
      }
      case 'companyName': {
        return 'Company Name';
      }
      case 'lastName': {
        return 'Last Name';
      }
      case 'code': {
        return 'Phone Code';
      }
      case 'code2': {
        return 'Mobile Code';
      }
      case 'telephoneNumber': {
        return 'Telephone Number';
      }
      case 'mobileNumber': {
        return 'MobileNumber Number';
      }
      case 'reference': {
        return 'Reference';
      }
      case 'bankName': {
        return 'Bank Name';
      }
      case 'accName': {
        return 'Account Number';
      }
      case 'branchName': {
        return 'Branch Name';
      }
      case 'supportCurrency': {
        return 'Support Currency';
      }
      case 'routingNumber': {
        return 'Routing Number';
      }
      case 'swiftCode': {
        return 'Swift Code';
      }
      case 'bankCode': {
        return 'Bank Code';
      }
      case 'referenceOther': {
        return 'Reference';
      }
      case 'label4': {
        return 'IfSC';
      }
      case 'label5': {
        return 'IBAN';
      }
      case 'label6': {
        return 'Branch Code';
      }
    }
  }
  //     this.getFormControlValue(3,'reference')
  submitTranser() {
    const body = {
      sendingCurrencyId: this.getFormControlValue(1, 'sendingCurrency')
        .agentTransferApprovedSendingCurrenciesId,
      recipientCountryId: this.getFormControlValue(3, 'country').countryId,
      recipientCurrencyId: this.getFormControlValue(1, 'recipientCurrency')
        .agentTransferApprovedReceivingCurrenciesId,
      reference:
        this.getFormControlValue(3, 'reference').referenceDescription ==
        'Others'
          ? 'Others ' + this.getFormControlValue(3, 'referenceOther')
          : this.getFormControlValue(3, 'reference').referenceDescription,
      sendAmount: parseFloat(
        this.getFormControlValue(1, 'sendingAmount').replace(/,/g, '')
      ),
      amountReceived: parseFloat(
        this.getFormControlValue(1, 'receivingAmount').replace(/,/g, '')
      ),
      transactionFee: parseFloat(
        this.getFormControlValue(1, 'transactionFee').replace(/,/g, '')
      ),
      totalPayable: parseFloat(
        this.getFormControlValue(1, 'totalAmount').replace(/,/g, '')
      ),
      agentCurrencyRateId: this.dataservice.agentCurrencyRateId,
      givenCurrencyRate: parseFloat(
        this.getFormControlValue(1, 'rate').replace(/,/g, '')
      ),
      agentCurrencyTransactionModeId: this.getFormControlValue(
        1,
        'transferMode'
      ).agentCurrencyTransactionModeId,
      agentSenderDetailsId: this.dataservice.senderData.agentSenderDetailsId,
      agentPaymentModeId: this.getFormControlValue(1, 'paymentMode'),
      identityModeId: this.getFormControlValue(2, 'idType'),
      identityModeValue: this.getFormControlValue(2, 'idNumber'),
      expireDate: this.getFormControlValue(2, 'idexpireDate'),
      issueDate: '2024-01-01',
      agentTransferFee: parseFloat(
        this.getFormControlValue(1, 'transactionFee').replace(/,/g, '')
      ),
      priorityLevel: 1,
      username: this.dataservice.senderData.email,
      agentExposableId: this.dataservice.agentExposableId,
      beneficiaryDetailId: this.dataservice.beneficiaryId,
      agentBeneficiaryBankDetailId:
        this.dataservice.selectBankAccount?.agentBeneficiaryBankDetailsId,
      portal: 'admin',
      browser: this.deviceInfo.browser,
      isMobile: false,
    };

    this.transferService.submitTransfer(body).subscribe((res: any) => {
      if (res['responseDto'] != null) {
        this.createNotification(
          'success',
          'Success',
          'Transaction Added successfully',
          '#ffffff',
          '#00A03E'
        );
        this.updateFinalStep();
        this.dataservice.beneficiaryId = null;
        this.close();
      } else {
        this.createNotification(
          'error',
          'Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  onAgentChange(agent: any) {
    this.getAgentAffiliate(agent);
    this.getAgentSubAgent(agent);
    this.getExposableID(agent);
  }
  SendingCurrencyChange(receivedData: any) {
    this.sendingCurrencyCode = receivedData.clientCurrencyId;
    this.getAgentReceivingCurrency(receivedData);
  }
  receivingCurrencyChange(receivedData: any) {
    this.receivingCurrencyId = receivedData.clientCurrencyId;
    this.getAgentTransactionMode(
      receivedData.agentTransferApprovedSendingReceivingCurrenciesId
    );
  }

  getExposableID(userName: any) {
    const data: any = {};
    data['username'] = userName.agentEmail;
    this.reportService
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['data'];
          // this.getcountryname(this.exposableId);
          this.dataservice.agentExposableId = this.exposableId;
          // console.log('exposable id', this.exposableId);
          this.getAgentSendingCurrency(this.exposableId);
          this.getCurrencyForBank(this.exposableId);
          this.getAgentPaymentMode();
        },
      });
  }
  getAgent() {
    this.transferService
      .getAllAgents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res['responseDto']) {
          this.allAgents = res['responseDto'];
        }
      });
  }

  getAgentAffiliate(agentId: any = null) {
    this.agentId = agentId.agentDetailId;
    this.dataservice.agentId = agentId.agentDetailId;
    this.dataservice.agentEmail = agentId.agentEmail;
    this.agentEmail = agentId.agentEmail;
    const data: any = {};
    data['agentId'] = this.getFormControlValue(1, 'agentName').agentDetailId;
    data['type'] = 'Affiliate';
    this.transferService.getAgentsByIdandType(data).subscribe((res) => {
      if (res['responseDto']) {
        this.affiliateAgents = res['responseDto'];
      } else {
        this.affiliateAgents = [];
      }
    });
  }
  getAgentSubAgent(agentId: any) {
    const data: any = {};
    data['agentId'] = agentId.agentDetailId;
    data['type'] = 'Sub Agent';
    this.transferService.getAgentsByIdandType(data).subscribe((res) => {
      if (res['responseDto']) {
        this.subAgents = res['responseDto'];
      } else {
        this.subAgents = [];
      }
    });
  }
  getAgentSendingCurrency(exposableId: any = null) {
    const data: any = {};
    data['exposableId'] = this.exposableId;
    this.transferService.getAgentSendingCurrency(data).subscribe((res) => {
      if (res['responseDto']) {
        this.agentSendingCurrency = res['responseDto'];
      } else {
        this.agentSendingCurrency = [];
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
        // this.getSendingAmount();
      }
    });
  }

  getAgentTransactionMode(id: any) {
    // this.receivingCurrencyId = id;
    this.dataservice.agentTransferCurrenciesId = id;
    const data: any = {};
    data['exposableId'] = this.exposableId;
    data['agentTransferApprovedSendingReceivingCurrenciesId'] = id;
    this.transferService.getAgentTransactionMode(data).subscribe((res) => {
      if (res['responseDto']) {
        this.transactionMode = res['responseDto'];
      } else {
        this.transactionMode = [];
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
      // this.getSendingAmount();

      this.maketransferForm.patchValue({
        sendingAmount: '',
        receivingAmount: '',
      });
    });
  }

  getAgentPaymentMode() {
    const data: any = {};
    data['exposableId'] = this.exposableId;
    this.transferService.getAgentPaymentMode(data).subscribe((res) => {
      if (res['responseDto']) {
        this.paymentModedata = res['responseDto'];
      } else {
        this.paymentModedata = [];
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
      // this.getTransferFeedetails();
    });
  }

  getAgentReceivingCurrency(ccy: any) {
    const data: any = {};
    data['exposableId'] = this.exposableId;
    data['currencyCode'] = ccy.currencyCode;
    this.transferService
      .getAgentSendingReceivingCurrency(data)
      .subscribe((res) => {
        if (res['responseDto']) {
          this.agentReceivingCurrency = res['responseDto'];
        } else {
          this.agentReceivingCurrency = [];
          this.createNotification(
            'error',
            'Input Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
        }
      });
  }

  getAllSignUpCountries() {
    const data: any = {};
    data['agentTransferAapprovedSendingReceivingCurrenciesId'] =
      this.dataservice.agentTransferCurrenciesId;
    this.transferService.getAgentReceivingCountries(data).subscribe((res) => {
      if (res['responseDto']) {
        this.countryData = res['responseDto'];
      } else {
        this.countryData = [];
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  getReference(receivedData: any) {
    const data: any = {};
    data['countryCode'] = receivedData.referenceCountryCode;
    this.transferService.getreference(data).subscribe((res) => {
      if (res['responseDto']) {
        this.referenceData = res['responseDto'];
      } else {
        this.referenceData = [];
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }

  saveFirstStep() {
    this.dataservice.totalamount = this.getFormControlValue(1, 'totalAmount');
    const body: any = {
      sendingCurrency: this.getFormControlValue(1, 'sendingCurrency')
        .currencyCode,
      recipientCurrency: this.getFormControlValue(1, 'recipientCurrency')
        .currencyCode,
      sendAmount: parseFloat(
        this.getFormControlValue(1, 'sendingAmount').replace(/,/g, '')
      ),
      amountReceived: parseFloat(
        this.getFormControlValue(1, 'receivingAmount').replace(/,/g, '')
      ),
      transactionMode: this.getFormControlValue(1, 'transferMode')
        .transactionModeId,
      transferFeesMode: 'FIXED',
      senderFirstName: this.dataservice.senderData.customerFirstName,
      senderLastName: this.dataservice.senderData.customerLastName,
      transferFee: parseFloat(
        this.getFormControlValue(1, 'transactionFee').replace(/,/g, '')
      ),
      totalAmountPayable: parseFloat(
        this.getFormControlValue(1, 'totalAmount').replace(/,/g, '')
      ),
      rate: parseFloat(this.getFormControlValue(1, 'rate').replace(/,/g, '')),
      paymentMode: this.getFormControlValue(1, 'paymentMode'),
      // recipientCountry: this.dataservice.AllFinalDataFirstStep.,
      date: format(new Date(), 'dd-MM-yyyy HH:mm'),
      status: '1stStep',
      agentName: this.dataservice.senderData.customerFirstName,
      exposableId: this.exposableId,
      customerReference: this.dataservice.senderData.customerReference
        ? this.dataservice.senderData.customerReference
        : '',
      beneficiaryFullName:
        this.dataservice.beneficiaryData.beneficiaryFirstName +
        ' ' +
        this.dataservice.beneficiaryData.beneficiaryLastName,
      beneficiaryFirstName:
        this.dataservice.beneficiaryData.beneficiaryFirstName,
      beneficiaryLastName: this.dataservice.beneficiaryData.beneficiaryLastName,
      // ipAddress: "192.168.1.100"
    };
    this.transferService.saveFirstStep(body).subscribe((res: any) => {
      if (res['responseDto']) {
        this.dataservice.transferFlowStepId = res['responseDto']['id'];
      }
    });
  }

  updateFinalStep() {
    const body: any = {
      agentName: this.dataservice.senderData.customerFirstName,
      exposableId: this.exposableId,
      customerReference: this.dataservice.senderData.customerReference,
      transferFlowStepId: this.dataservice.transferFlowStepId,
      sendingCurrency: this.getFormControlValue(1, 'sendingCurrency')
        .currencyCode,
      recipientCurrency: this.getFormControlValue(1, 'recipientCurrency')
        .currencyCode.currencyCode,
      sendAmount: parseFloat(
        this.getFormControlValue(1, 'sendingAmount').replace(/,/g, '')
      ),
      amountReceived: parseFloat(
        this.getFormControlValue(1, 'receivingAmount').replace(/,/g, '')
      ),
      ripplenetQuoteId: null,
      transactionMode: this.getFormControlValue(1, 'transferMode')
        .transactionModeId,
      transferFeesMode: 'FIXED',
      transferFee: parseFloat(
        this.getFormControlValue(1, 'transactionFee').replace(/,/g, '')
      ),
      totalAmountPayable: parseFloat(
        this.getFormControlValue(1, 'totalAmount').replace(/,/g, '')
      ),
      rate: parseFloat(this.getFormControlValue(1, 'rate').replace(/,/g, '')),
      paymentMode: this.getFormControlValue(1, 'paymentMode')
        .agentPaymentModeId,
      senderDetailsId: this.dataservice.senderData.agentSenderDetailsId,
      senderFirstName: this.dataservice.senderData.customerFirstName,
      senderLastName: this.dataservice.senderData.customerLastName,
      senderTelephone: this.dataservice.senderData.telephoneNo,
      senderMobile: this.dataservice.senderData.handphoneNo,
      senderEmailAddress: this.dataservice.senderData.email,
      residentialAddress: this.dataservice.senderData.residentialAddress,
      confirmIdentity: 'Yes',
      identityNumber: this.dataservice.senderData.identityModeValue,
      country: this.dataservice.senderData.nationalityValue,
      beneficiaryFullName:
        this.dataservice.beneficiaryData.beneficiaryFirstName +
        ' ' +
        this.dataservice.beneficiaryData.beneficiaryLastName,
      beneficiaryFirstName:
        this.dataservice.beneficiaryData.beneficiaryFirstName,
      beneficiaryLastName: this.dataservice.beneficiaryData.beneficiaryLastName,
      contactNumber: this.dataservice.beneficiaryData.contactNumber,
      address: this.dataservice.beneficiaryData.beneficiaryAddress,
      // recipientCountry:
      //   this.dataservice.AllFinalDataSecondStep.recipientCountryName,
      dateOfBirth: this.dataservice.beneficiaryData.dateOfBirth,
      bank: this.dataservice.selectBankAccount?.bankName,
      accountNumber: this.dataservice.selectBankAccount?.accountNo,
      bankBranch: this.dataservice.selectBankAccount?.branchName,
      reference: this.dataservice.selectBankAccount?.referenceSelectName,
      referenceOther: null,
      bankName: this.dataservice.selectBankAccount?.bankName,
      accNo: this.dataservice.selectBankAccount?.accountNo,
      branchName: this.dataservice.selectBankAccount?.branchName,
      bankCode: this.dataservice.selectBankAccount?.bankCode,
      swiftCode: this.dataservice.selectBankAccount?.swiftCode,

      selectedBank: this.dataservice.selectBankAccount?.bankName,
      accountNumberBankCode: this.dataservice.selectBankAccount?.bankCode,
      accountNumberSwiftCode: this.dataservice.selectBankAccount?.swiftCode,
      isActiveBeneficiary: true,
      isCoporateBeneficiary: this.dataservice.beneficiaryData.isCorporate,
      mobileProviders: true,
      // invoice: 'INV-12345',
      status: 'lastStepTransactionSuccessfullyCompleted',
    };
    this.transferService.updateFinalStep(body).subscribe((res: any) => {
      if (res['responseDto']) {
      }
    });
  }

  updateSenderIdData() {
    const body = {
      agentTransactionSenderIdentityValuesId:
        this.dataservice.senderData.agentSenderIdentityId,
      identityModeValue: this.getFormControlValue(2, 'idNumber'),
      expiraryDate: this.getFormControlValue(2, 'idexpireDate'),
      agentSenderDetailsDto: {
        agentSenderDetailsId: this.dataservice.senderData.agentSenderDetailsId,
      },
      agentIdentityModeId: this.getFormControlValue(2, 'idType'),
    };
    this.transferService.updateSenderId(body).subscribe(() => {});
  }
  updateSenderNewIdData() {
    const body = {
      identityModeValue: this.getFormControlValue(2, 'idNumber'),
      expiraryDate: this.getFormControlValue(2, 'idexpireDate'),
      agentSenderDetailsDto: {
        agentSenderDetailsId: this.dataservice.senderData.agentSenderDetailsId,
      },
      agentIdentityModeId: this.getFormControlValue(2, 'idType'),
    };
    this.transferService.updateSenderId(body).subscribe(() => {});
  }

  newIndexvalue(value: any) {
    this.index = value;
    this.step = value;
  }
}
