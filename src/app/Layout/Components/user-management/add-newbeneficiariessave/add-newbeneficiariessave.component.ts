import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { MyValidators } from 'src/app/validators/custom-validators';
import { BeneficiariesComponent } from '../beneficiaries/beneficiaries.component';
import { ReportService } from 'src/app/_services/report.service';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
import { CustomValidators } from 'src/app/_helpers/custom-validators';

@Component({
  selector: 'app-add-newbeneficiariessave',
  templateUrl: './add-newbeneficiariessave.component.html',
  styleUrls: ['./add-newbeneficiariessave.component.sass'],
})
export class AddNewbeneficiariessaveComponent {
  beneficiarysave!: FormGroup;

  @ViewChild(BeneficiariesComponent)
  BenificierInfo!: BeneficiariesComponent;

  destroy$: Subject<boolean> = new Subject<boolean>();
  countryDetails: any;
  referenceCountryCode: any;
  currencyDetails: any;
  exposableId: any;
  currentUser: any;
  bankCodeLabel: any;
  swiftCodeLabel: any;
  rountingNumber: any;
  label4: any;
  label5: any;
  label6: any;
  showBankCodeField = false;
  showSwiftCodeField = false;
  showRoutingNumber = false;
  showIfsc = false;
  showIban = false;
  showBranchCode = false;
  dCountryId: any;
  fieldValid = true;
  pageNumber = 1;
  pageSize = 10;
  benificiaryDetails: any;
  totalRecords: any;
  selectCountryId: any;
  bankDetails: any;

  ngOnInit() {
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

    this.beneficiarysave = this.fb.group({
      Country: [null, [Validators.required]],
      BankName: [null, [Validators.required]],
      AccountNumber: [
        null,
        [Validators.compose([Validators.required, maxLength(30)])],
      ],
      BranchName: [
        null,
        [
          Validators.compose([
            Validators.required,
            CustomValidators.alphanumericWithSpaces(5, 35),
          ]),
        ],
      ],
      Currency: [null, [Validators.required]],
      BankCode: [null, null],
      SwiftCode: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.alphanumericPattern(8, 11),
        ]),
      ],
      routingNumber: [null, null],
      ifsc: [null, null],
      iban: [null, null],
      branchCode: [null, null],
    });

    this.getBenificieryCountries();
    this.getExposableId();
  }

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private benificiaryService: BenificiaryService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder,
    public modalRef: NzModalRef,
    private eventTriggerService: EventtriggerService,
    private reportService: ReportService,
    private transferService: TransferTabService
  ) {
    {
      this.currentUser = commonService.parseJwt(tokenService.getToken());
    }
  }

  get Country() {
    return this.beneficiarysave.get('Country');
  }
  get BankName() {
    return this.beneficiarysave.get('BankName');
  }

  get AccountNumber() {
    return this.beneficiarysave.get('AccountNumber');
  }

  get BranchName() {
    return this.beneficiarysave.get('BranchName');
  }

  get Currency() {
    return this.beneficiarysave.get('Currency');
  }

  get BankCode() {
    return this.beneficiarysave.get('BankCode');
  }

  get SwiftCode() {
    return this.beneficiarysave.get('SwiftCode');
  }

  get routingNumber() {
    return this.beneficiarysave.get('routingNumber');
  }
  get ifsc() {
    return this.beneficiarysave.get('ifsc');
  }
  get iban() {
    return this.beneficiarysave.get('iban');
  }
  get branchCode() {
    return this.beneficiarysave.get('branchCode');
  }

  getExposableId() {
    const data: any = {};
    data['username'] = this.dataService.agentEmailSelectBenefit; //this.currentUser.sub;
    this.reportService
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['data'];
          this.getcountryname();
          this.getBenificieryCurrencies(this.exposableId);
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.beneficiarysave.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'Country': {
        return 'Country';
      }
      case 'BankName': {
        return 'Bank Name';
      }
      case 'AccountNumber': {
        return 'Account Number';
      }
      case 'BranchName': {
        return 'Branch Name';
      }
      case 'Currency': {
        return 'Currency';
      }
      case 'BankCode': {
        return 'Bank Code';
      }
      case 'SwiftCode': {
        return 'Swift Code';
      }
      case 'routingNumber': {
        return 'Routing Number';
      }
      case 'ifsc': {
        return 'Ifsc';
      }
      case 'iban': {
        return 'Iban';
      }
      case 'branchCode': {
        return 'BranchCode';
      }
    }
  }

  getBenificieryCountries() {
    const data: any = {};

    data['countryId'] = this.dataService.countryId;

    this.benificiaryService
      .getBenificieryCountries(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            console.log('countries', res);

            this.countryDetails = [res['responseDto']];

            this.referenceCountryCode =
              res['responseDto']['referenceCountryCode'];
          }
        },
      });
  }

  getBenificieryCurrencies(exposableId: any) {
    const data: any = {};

    data['exposableId'] = exposableId; //this.exposableId

    this.benificiaryService
      .getAgentReceivingCurrency(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.currencyDetails = res['responseDto'];
          }
        },
      });
  }

  addNewBank() {
    if (this.fieldValid === false) {
      this.beneficiarysave.get('SwiftCode')?.setValidators(null);
      this.beneficiarysave.get('SwiftCode')?.updateValueAndValidity();
    }

    if (!this.beneficiarysave.valid) {
      this.validateAllFormFields(this.beneficiarysave);
      return;
    }

    const data: any = {};
    data['exposableId'] = this.exposableId;
    data['currencyID'] = this.Country?.value; //this.dataService.countryId

    const formData = {
      bankName:
        this.selectCountryId == 1
          ? this.BankName?.value.bankname
          : this.BankName?.value,
      branchName: this.BranchName?.value,
      beneficiaryDetailsId: this.dataService.personalbenId,
      accountNumber: this.AccountNumber?.value
        ? this.AccountNumber?.value
        : undefined,
      isActive: false,
      //BankCode:this.ba?.value,
      clientCurrencyId: this.Currency?.value,
      countryId: this.Country?.value,
      bankCode:
        this.selectCountryId == 1
          ? this.BankName?.value.bankCode
          : this.BankCode?.value
          ? this.BankCode?.value
          : undefined,
      swiftCode: this.SwiftCode?.value ? this.SwiftCode?.value : undefined,
      routingNumber: this.routingNumber?.value
        ? this.routingNumber?.value
        : undefined,
      label4: this.ifsc?.value ? this.ifsc?.value : undefined,
      label5: this.iban?.value ? this.iban?.value : undefined,
      label6: this.branchCode?.value ? this.branchCode?.value : undefined,
    };

    this.benificiaryService.addNewBank(data, formData).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'New Bank Added Successfully.',
            { nzStyle: { background: '#00A03E', color: '#ffff' } }
          );
          this.getAllBenificiaryData();
          this.close();
          this.eventTriggerService.onReloadServiceData('onBankSave');
          // location.reload();
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];

          this.createNotification('error', msg, '#cc2d2d', 'Error');
        } else {
          this.notificationService.create(
            'error',
            'Error',
            'New Bank Adding Failed',
            { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
          );
        }
      },
    });
  }

  letterOnly(event: any): boolean {
    const separator = /^[a-zA-Z\s]*$/;
    return separator.test(event.key);
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getbank(recevieddata: any) {
    const data: any = {};
    data['username'] = 'JVb3mfaNS29';
    data['countryId'] = recevieddata;

    this.reportService.getbankdetails(data).subscribe((res: any) => {
      this.bankDetails = res['responseDto'];
    });
  }
  getDynamicLabels(id: any) {
    this.getbank(id);
    this.selectCountryId = id;
    const data: any = {};
    data['countryID'] = this.Country?.value;

    this.benificiaryService
      .getDynamicLabels(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.bankCodeLabel = res['responseDto']['bankCodeLabel'];
            this.swiftCodeLabel = res['responseDto']['swiftCodeLabel'];
            this.rountingNumber = res['responseDto']['routingNumberLabel'];
            this.label4 = res['responseDto']['label4'];
            this.label5 = res['responseDto']['label5'];
            this.label6 = res['responseDto']['label6'];

            this.dCountryId = res['responseDto']['countryId'];

            if (this.bankCodeLabel === 'Bank Code') {
              this.showBankCodeField = true;
            } else {
              this.showBankCodeField = false;
            }
            if (this.swiftCodeLabel === 'Swift Code') {
              this.showSwiftCodeField = true;
            } else {
              this.showSwiftCodeField = false;
            }
            if (this.rountingNumber === 'Routing Number') {
              this.showRoutingNumber = true;
            } else {
              this.showRoutingNumber = false;
            }
            if (this.label4 === 'IFSC') {
              this.showIfsc = true;
            } else {
              this.showIfsc = false;
            }
            if (this.label5 === 'IBAN') {
              this.showIban = true;
            } else {
              this.showIban = false;
            }
            if (this.label6 === 'Branch Code') {
              this.showBranchCode = true;
            } else {
              this.showBranchCode = false;
            }

            this.selectBankDetailsValidations();
            this.swiftCodeValidation();
          }
        },
      });
  }

  selectBankDetailsValidations() {
    if (this.showIban === true) {
      this.iban!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.alphanumericPattern(15, 34),
        ])
      );
      this.iban!.updateValueAndValidity();
      this.ifsc!.setValidators(null);
      this.ifsc!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
      this.BankCode!.setValidators(null);
      this.BankCode!.updateValueAndValidity();
    } else if (this.showBankCodeField === true) {
      this.BankCode!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.exactLength('Bank Code', 3),
        ])
      );
      this.BankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.ifsc!.setValidators(null);
      this.ifsc!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
    } else if (this.showIfsc === true) {
      this.ifsc!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.specificPattern(),
        ])
      );
      this.ifsc!.updateValueAndValidity();
      this.BankCode!.setValidators(null);
      this.BankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
    } else if (this.showRoutingNumber === true) {
      this.routingNumber!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.exactLength('Routing Number', 9),
        ])
      );
      this.routingNumber!.updateValueAndValidity();
      this.ifsc!.setValidators(null);
      this.ifsc!.updateValueAndValidity();
      this.BankCode!.setValidators(null);
      this.BankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
    } else if (this.showBranchCode === true) {
      this.branchCode!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.exactLength('Branch Code', 5),
        ])
      );
      this.branchCode!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.ifsc!.setValidators(null);
      this.ifsc!.updateValueAndValidity();
      this.BankCode!.setValidators(null);
      this.BankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
    }
  }

  swiftCodeValidation() {
    if (this.showSwiftCodeField === true) {
      this.SwiftCode!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.alphanumericPattern(8, 11),
        ])
      );
      this.SwiftCode!.updateValueAndValidity();
    }
  }

  createNotification(
    type: string,
    content: string,
    bgcolor: string,
    title: any
  ): void {
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: bgcolor,
        color: '#FFF',
      },
      nzDuration: 4500,
    });
  }

  close() {
    this.modalRef.close();
  }

  getAllBenificiaryData() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.benificiaryService
      .getAllBenificiaryData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.benificiaryDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.benificiaryDetails = [];
            this.totalRecords = 0;
          }
        },
      });
  }

  getcountryname() {
    const data: any = {};
    data['exposeId'] = this.exposableId;
    this.transferService.getcountryname(data).subscribe((res: any) => {
      this.countryDetails = res['responseDto'];
    });
  }
}
