import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  NgZone,
  Output,
} from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import format from 'date-fns/format';
import { Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormBuilder,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.sass'],
})
export class BeneficiaryDetailsComponent {
  @Input() formGroupName!: string;
  @Input() countryData: any;
  @Input() bankCurrencyList: any;
  @Input() referenceData: any;
  @Output() getRef: EventEmitter<any> = new EventEmitter();
  maketransferForm!: FormGroup;
  public makeTransfrFlow3!: FormGroup;
  mySwitchValue = false;
  isDisabled = true;
  isNewBeneficiary = true;
  isNewBank = false;
  isCashPickup = false;
  private searchNameData = new Subject<any>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  isbuttonClicked = false;
  countryCodeData: any;
  nationalityData: any;
  // referenceData: any;
  beneficiaryData: any;
  nameVal: any;
  senderDetailsResult: any;
  data$: any;
  beneficiaries: any;
  pageSize: any = 1000;
  pageNumber: any = 1;
  beneficiarySingleData: any;
  switchValue: any = false;
  beneficiaryBankData: any;
  selectedCountryId: any;
  statusSelect: any;
  bankList: any;
  isBankSl = false;
  newBank = true;
  selectedAccountDetails: any;

  showBank = false;
  newBenId: any;
  isDateOfBirthValid = false;
  exposableId: any;
  receivingCountriesData: any;
  bankCodeInput!: boolean;
  swiftCodeInput!: boolean;
  routingNumber!: boolean;
  IfsccodeLable!: boolean;
  IbanCodeLable!: boolean;
  BranchCodeLable!: boolean;

  selectedBank: any;
  isbankSl: any;
  provideReason = false;
  constructor(
    private rootFormFroup: FormGroupDirective,
    private formBuilder: FormBuilder,
    private transferService: MakeTransferService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService,
    private notificationService: NzNotificationService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
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
      specificPattern,
    } = CustomValidators;
    if (this.dataService.selectedBank != null) {
      this.selectedBank = this.dataService.selectedBank;
    }
    if (this.dataService.transferAs.transactionModeDesc == 'Cash Pickup') {
      this.isCashPickup = true;
    }
    this.maketransferForm = this.rootFormFroup.control.get(
      this.formGroupName
    ) as FormGroup;
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'senderChanged') {
          this.clerData();
          this.dataService.selectedBankId = null;
          this.beneficiaryBankData = [];
          this.beneficiaryData = [];
          this.maketransferForm.patchValue({
            companyName: null,
            telephoneNumber: null,
            residentalAddress: null,
            reference: null,
            code: null,
            code2: null,
            mobileNumber: null,
            firstName: null,
            lastName: null,
            dob: null,
            placeOfBirth: null,
            nationality: null,
            bankName: null,
            accName: null,
            branchName: null,
            bankCode: null,
            routingNumber: null,
            swiftCode: null,
            label4: null,
            label5: null,
            label6: null,
          });
        }
      },
    });

    // this.maketransferForm.get('supportCurrency')?.disable();
    this.maketransferForm.get('searchBeneficiary')?.enable();

    if (this.dataService.newBenStatus == true) {
      this.mySwitchValue = true;
    } else {
      this.mySwitchValue = false;
    }
    this.getNationality();

    this.getCountryCodeforPhone();
    // this.getBeneficiariesData();
    this.disabledFields();
    this.disableBankFields();
    if (this.maketransferForm.get('country')?.value != null) {
      // this.isHide = true;
      this.getBankAccountsById(this.dataService.selectedBankId);
      this.newBank = false;
      this.getBankAccountDetails();
      this.getBankCodes();
      // console.log('Condition Met', this.newBank);
      // console.log('Condition Met', this.beneficiaryBankData);
    }
    if (this.dataService.beneficiaryId != null) {
      this.getBeneficiaryDetailsById(this.dataService.beneficiaryId);
      this.getBankAccountDetails();
      this.getBankAccountDetails();
    }
    if (this.maketransferForm.get('reference')?.value?.referenceId == 164) {
      this.provideReason = true;
    } else {
      this.provideReason = false;
    }
    if (this.maketransferForm.get('country')?.value != null) {
      this.getBeneficiariesData();
    }

    this.maketransferForm.patchValue({
      country: this.dataService.saveClientCountryValue,
    });
  }
  isHide!: boolean;
  disabledFields() {
    this.maketransferForm.get('companyName')?.disable();
    this.maketransferForm.get('firstName')?.disable();
    this.maketransferForm.get('lastName')?.disable();
    this.maketransferForm.get('code')?.disable();
    this.maketransferForm.get('code2')?.disable();
    this.maketransferForm.get('telephoneNumber')?.disable();
    this.maketransferForm.get('mobileNumber')?.disable();
    this.maketransferForm.get('residentalAddress')?.disable();
    this.maketransferForm.get('supportCurrency')?.disable();
  }
  enableFields() {
    this.maketransferForm.get('companyName')?.enable();
    this.maketransferForm.get('firstName')?.enable();
    this.maketransferForm.get('lastName')?.enable();
    this.maketransferForm.get('code')?.enable();
    this.maketransferForm.get('code2')?.enable();
    this.maketransferForm.get('telephoneNumber')?.enable();
    this.maketransferForm.get('mobileNumber')?.enable();
    this.maketransferForm.get('residentalAddress')?.enable();
    this.maketransferForm.get('supportCurrency')?.enable();
  }
  onSwitchChange(event: boolean): void {
    this.mySwitchValue = event;

    this.isHide = false;
    this.isNewBank = false;
    // console.log(this.switchValue);
    this.beneficiaryTypeChange();
  }

  createBeneficiary() {
    this.enableFields();
    this.maketransferForm.get('searchBeneficiary')?.disable();
    this.maketransferForm.get('searchBeneficiary')?.setValue(null);
    this.isDisabled = false;
    this.isNewBeneficiary = false;
    this.beneficiaryBankData = null;
    this.beneficiaryData = [];
    this.CreateBank();
    this.clearBank();
    this.maketransferForm.patchValue({
      companyName: null,
      telephoneNumber: null,
      residentalAddress: null,
      code: null,
      code2: null,
      mobileNumber: null,
      firstName: null,
      lastName: null,
      dob: null,
      placeOfBirth: null,
      nationality: null,
      bankName: null,
      accName: null,
      branchName: null,
      bankCode: null,
      routingNumber: null,
      supportCurrency: null,
      swiftCode: null,
      label4: null,
      label5: null,
      label6: null,
    });
    this.beneficiaryTypeChange();
  }
  clerData() {
    this.clearBank();
    this.maketransferForm.patchValue({
      companyName: null,
      telephoneNumber: null,
      residentalAddress: null,
      code: null,
      code2: null,
      mobileNumber: null,
      firstName: null,
      lastName: null,
      dob: null,
      placeOfBirth: null,
      nationality: null,
      bankName: null,
      accName: null,
      branchName: null,
      bankCode: null,
      routingNumber: null,
      swiftCode: null,
      supportCurrency: null,
      label4: null,
      label5: null,
      label6: null,
    });
  }

  existingBeneficiary() {
    this.maketransferForm.get('searchBeneficiary')?.enable();
    this.isDisabled = true;
    this.isNewBeneficiary = true;
    this.disabledFields();
    this.getBeneficiariesData();
    this.isNewBank = false;
    this.isHide = false;

    // this.isbuttonClicked = !this.isbuttonClicked
    //disabling formcountrols
  }

  CreateBank() {
    this.newBank = true;
    this.isNewBank = true;
    this.isHide = true;
    this.enableBankFields();
    this.getBankCodes();
    this.selectedBank = null;
    this.selectedAccountDetails = null;
    this.maketransferForm.patchValue({
      bankName: null,
      accName: null,
      branchName: null,
      routingNumber: null,
      bankCode: null,
      swiftCode: null,
      // supportCurrency: null,
      label4: null,
      label5: null,
      label6: null,
    });
  }

  existingBank() {
    this.isHide = false;
    this.isNewBank = false;
    this.newBank = false;
    this.disableBankFields();
    this.selectedAccountDetails = null;
    this.clearBank();
  }

  getCountryCodeforPhone() {
    this.transferService.getCountryCode().subscribe((res) => {
      if (res['responseDto']) {
        this.countryCodeData = res['responseDto'];
      } else {
        this.countryCodeData = [];
      }
    });
  }
  getNationality() {
    this.transferService.getNationality().subscribe((res) => {
      if (res['responseDto']) {
        this.nationalityData = res['responseDto'];
      } else {
        this.nationalityData = [];
      }
    });
  }

  getReference(receivedData: any) {
    this.dataService.saveClientCountryValue = receivedData;
    this.maketransferForm.get('searchBeneficiary')?.setValue(null);
    this.beneficiaryData = [];
    this.newBank = true;
    this.beneficiaryBankData = [];
    this.dataService.beneficiaryData = null;
    this.isbankSl = receivedData.clientCountryId;
    this.getRef.emit(receivedData);
    this.getBankCodes();
    this.getBankList(this.selectedCountryId);
    this.getBeneficiariesData(receivedData.clientCountryId);
    if (this.dataService.beneficiaryData != null) {
      this.getBankAccountDetails();
    }
    this.clearBank();
    this.clerData();
  }

  getBeneficiary(id: any = null) {
    const data: any = {};
    data['agentBeneficiaryDetailsId'] = id;
    this.transferService.getBeneficiary(data).subscribe((res) => {
      if (res['responseDto']) {
        this.beneficiaryData = res['responseDto'];
        this.dataService.newBenStatus = this.beneficiaryData.isCorporate;
      } else {
        this.beneficiaryData = [];
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

  onChangeSender(data: any) {
    this.dataService.beneficiaryId = data;
    if (this.dataService.selectedBank != null) {
      this.selectedBank = this.dataService.selectedBank;
    }
    this.senderDetailsResult = data;
    this.getBeneficiaryDetailsById(this.dataService.beneficiaryId);
    this.beneficiaryTypeChange();
    this.clearBank();
    this.selectedBank = null;
    this.selectedAccountDetails = null;
    if (data == null) {
      this.clerData();
      this.clearBank();
      this.selectedAccountDetails = null;
      this.selectedBank = null;
      this.beneficiaryBankData = [];
      // this.isHide = true;
      this.dataService.selectedBankId = null;
    }
  }
  clearBank() {
    this.maketransferForm.get('bankName')?.setValue(null);
    this.maketransferForm.get('accName')?.setValue(null);
    this.maketransferForm.get('branchName')?.setValue(null);
    this.maketransferForm.get('supportCurrency')?.setValue(null);
    this.maketransferForm.get('bankCode')?.setValue(null);
    this.maketransferForm.get('routingNumber')?.setValue(null);
    this.maketransferForm.get('swiftCode')?.setValue(null);
    this.maketransferForm.get('label4')?.setValue(null);
    this.maketransferForm.get('label5')?.setValue(null);
    this.maketransferForm.get('label6')?.setValue(null);
    this.dataService.selectedBank = null;
    // this.beneficiaryBankData = null;
    this.maketransferForm.patchValue({
      bankName: null,
      accName: null,
      branchName: null,
      routingNumber: null,
      bankCode: null,
      swiftCode: null,
      supportCurrency: null,
      label4: null,
      label5: null,
      label6: null,
    });
  }
  validateDob() {
    let currentDate = new Date();
    let selectionDate =
      Number(
        format(new Date(this.maketransferForm.get('dob')?.value), 'yyyy')
      ) *
        365 +
      Number(format(new Date(this.maketransferForm.get('dob')?.value), 'MM')) *
        30 +
      Number(format(new Date(this.maketransferForm.get('dob')?.value), 'dd'));
    let formatterCurrentDate =
      Number(format(new Date(currentDate), 'yyyy')) * 365 +
      Number(format(new Date(currentDate), 'MM')) * 30 +
      Number(format(new Date(currentDate), 'dd'));

    let validate = formatterCurrentDate - selectionDate;

    if (validate < 16 * 365) {
      // this.notificationService.createNotification('error', 'Age can not be below 16 years', '#cc2d2d', 'Input Error');
      this.createNotification(
        'error',
        'Input Error',
        'Age can not be below 16 years',
        '#ffffff',
        '#cc2d2d'
      );
      this.isDateOfBirthValid = false;
    } else {
      this.isDateOfBirthValid = true;
    }
  }
  getBeneficiariesData(countryId: any = null) {
    const data: any = {};
    data['email'] = this.dataService.senderData.email;
    data['countryId'] =
      this.maketransferForm.get('country')?.value.clientCountryId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['isCustomer'] = true;
    return this.transferService
      .getBeneficiaryByFIlter(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.beneficiaryData = res['responseDto']['payload'];
        } else {
          this.beneficiaryData = [];
        }
      });
  }

  getBeneficiaryDetailsById(value: any) {
    const data: any = {};
    data['agentBeneficiaryDetailsId'] = value
      ? value
      : this.dataService.beneficiaryId;
    return this.transferService
      .getBeneficiaryDetailsById(data)
      .subscribe((res: any) => {
        if (res['responseDto'] !== null) {
          this.beneficiarySingleData = res['responseDto'];
          this.dataService.newBenStatus =
            this.beneficiarySingleData.isCorporate;

          if (res['responseDto']['isCorporate'] === true) {
            this.mySwitchValue = true;
          } else {
            this.mySwitchValue = false;
          }

          this.dataService.beneficiaryData = this.beneficiarySingleData;
          // console.log(this.beneficiarySingleData);
          setTimeout(() => {
            if (res['responseDto']['isCorporate'] === true) {
              this.patchForm(this.beneficiarySingleData);
            } else {
              this.patchForm(this.beneficiarySingleData); // If you need to call patchForm in both cases, you can remove this else block.
            }
          }, 200);

          this.getBankAccountDetails(res['responseDto']['supportCurrency']);
          this.newBank = false;
        } else if (res['errorDescription']) {
          this.createNotification(
            'error',
            'Input Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
          this.maketransferForm.get('searchBeneficiary')?.reset();
          this.resetvalue();
          this.beneficiarySingleData = [];
          this.dataService.beneficiaryData = null;
          this.newBank = true;
        } else {
          this.beneficiarySingleData = [];
          this.dataService.beneficiaryData = null;
          this.newBank = true;
        }
      });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['someInput']) {
  //     this.patchForm(this.someInput);
  //   }
  // }

  patchForm(data: any) {
    if (this.mySwitchValue === true) {
      this.maketransferForm.patchValue({
        companyName: data.beneficiaryFirstName,
        telephoneNumber: data.contactNumber,
        residentalAddress: data.beneficiaryAddress,
        code: data.contactId,
        code2: data.mobileCountryCode,
        mobileNumber: data.beneficiaryMobileNumber,
        supportCurrency: data.supportCurrency,
      });
    } else {
      this.maketransferForm.patchValue({
        firstName: data.beneficiaryFirstName,
        lastName: data.beneficiaryLastName,
        telephoneNumber: data.contactNumber,
        residentalAddress: data.beneficiaryAddress,
        code: data.contactId,
        code2: data.mobileCountryCode,
        dob: data.dateOfBirth,
        placeOfBirth: data.beneficiaryPlaceOfBirth,
        nationality: data.nationalityDetailId,
        mobileNumber: data.beneficiaryMobileNumber,
        supportCurrency: data.supportCurrency,
      });
    }

    // setTimeout(() => {
    //   if (data.isCorporate == true) {
    //     this.switchValue = true;
    //     if (this.switchValue === true) {
    //       this.maketransferForm.patchValue({
    //         companyName: data.beneficiaryFirstName,
    //         telephoneNumber: data.contactNumber,
    //         residentalAddress: data.beneficiaryAddress,
    //         code: data.contactId,
    //         code2: data.mobileCountryCode,
    //         mobileNumber: data.beneficiaryMobileNumber,
    //       });
    //     }
    //   } else {
    //     this.switchValue = false;
    //     if (this.switchValue === false) {
    //       this.maketransferForm.patchValue({
    //         firstName: data.beneficiaryFirstName,
    //         lastName: data.beneficiaryLastName,
    //         telephoneNumber: data.contactNumber,
    //         residentalAddress: data.beneficiaryAddress,
    //         code: data.contactId,
    //         code2: data.mobileCountryCode,
    //         dob: data.dateOfBirth,
    //         placeOfBirth: data.beneficiaryPlaceOfBirth,
    //         nationality: data.nationalityDetailId,
    //         mobileNumber: data.beneficiaryMobileNumber,
    //       });
    //     }
    //   }
    //   this.cdr.detectChanges(); // Trigger change detection manually
    // }, 0);
  }

  getBankAccountDetails(supportCurrencyId: any = null) {
    const data: any = {};
    data['countryId'] = this.maketransferForm.get('country')?.value.countryId;
    data['agentTransferApprovedSendingReceivingCurrenciesId'] =
      supportCurrencyId;
    data['agentBeneficiaryDetailsId'] = this.dataService.beneficiaryId;
    return this.transferService
      .getAgentBeneficiaryBankAccounts(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.beneficiaryBankData = res['responseDto'];
        } else {
          this.createNotification(
            'error',
            'Input Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
          this.beneficiaryBankData = [];
        }
      });
  }
  patchBankForm(data: any) {
    if (data != null) {
      // this.isHide = true;
      this.maketransferForm.patchValue({
        bankName: data.bankName,
        accName: data.accountNo,
        branchName: data.branchName,
        bankCode: data.bankCode,
        routingNumber: data.routingNumber,
        swiftCode: data.swiftCode,
        label4: data.label4,
        label5: data.label5,
        label6: data.label6,
      });
    }
  }
  saveNewBankDetails() {
    if ((this.isDateOfBirthValid = false)) {
      this.validateDob();
    } else {
      const data: any = {};
      data['agentExposableId'] = this.dataService.agentExposableId;
      data['countryId'] = this.maketransferForm.get('country')?.value.countryId;

      const body = {
        bankName:
          this.isbankSl == 1
            ? this.maketransferForm.get('bankName')?.value.bankname
            : this.maketransferForm.get('bankName')?.value,
        swiftCode: this.maketransferForm.get('swiftCode')?.value
          ? this.maketransferForm.get('swiftCode')?.value
          : undefined,
        bankCode:
          this.isbankSl == 1
            ? this.maketransferForm.get('bankName')?.value.bankCode
            : this.receivingCountriesData.bankCodeLabel == 'Bank Code'
            ? this.maketransferForm.get('bankCode')?.value
            : undefined,

        branchName: this.maketransferForm.get('branchName')?.value,
        beneficiaryDetailsId: this.dataService.beneficiaryId,
        accountNumber: this.maketransferForm.get('accName')?.value,
        clientCurrencyId: this.maketransferForm.get('supportCurrency')?.value,
        countryId: this.maketransferForm.get('country')?.value.countryId,
        isActive: true,
        routingNumber: this.maketransferForm.get('routingNumber')?.value
          ? this.maketransferForm.get('routingNumber')?.value
          : undefined,

        label4: this.receivingCountriesData.label4
          ? this.maketransferForm.get('label4')?.value
          : undefined,
        label5: this.receivingCountriesData.label5
          ? this.maketransferForm.get('label5')?.value
          : undefined,
        Transistnumber:
          this.receivingCountriesData.bankCodeLabel == 'trnasitnumber'
            ? this.maketransferForm.get('bankCode')?.value
            : undefined,

        label6: this.receivingCountriesData.label6
          ? this.maketransferForm.get('label6')?.value
          : undefined,
      };
      this.transferService.saveAgentBanks(data, body).subscribe((res: any) => {
        if (res['responseDto'] != null) {
          if (res['responseDto']) {
            this.eventTriggerService.onReloadServiceData();
            this.isNewBank = false;
            this.newBank = false;
            this.getBankAccountsById(
              res['responseDto']['agentBeneficiaryBankAccountDetailsId']
            );

            this.getBankList();
            this.getBankAccountDetails(
              this.maketransferForm.get('supportCurrency')?.value
            );
            this.dataService.selectedBank =
              res['responseDto']['agentBeneficiaryBankAccountDetailsId'];
            this.selectedBank =
              res['responseDto']['agentBeneficiaryBankAccountDetailsId'];
            this.createNotification(
              'success',
              'Success',
              'Beneficiary Bank details Added successfully',
              '#ffffff',
              '#00A03E'
            );
          }
          if (this.dataService.beneficiaryData != null) {
            this.eventTriggerService.onReloadServiceData('nextStep');
          }
          this.getBeneficiaryDetailsById(this.dataService.beneficiaryId);
        } else {
          this.createNotification(
            'error',
            'Error',
            res['errors'],
            '#ffffff',
            '#cc2d2d'
          );
        }
      });
    }
  }
  saveNewPersonalBeneficiary() {
    if (this.maketransferForm.get('dob')?.value && !this.isDateOfBirthValid) {
      this.validateDob();
    } else {
      const body = {
        beneficiaryFirstName: this.maketransferForm.get('firstName')?.value,
        beneficiaryLastName: this.maketransferForm.get('lastName')?.value,
        contactId: this.maketransferForm.get('code')?.value,
        contactNumber: this.maketransferForm.get('telephoneNumber')?.value,
        mobileId: this.maketransferForm.get('code2')?.value,
        mobileNumber: this.maketransferForm.get('mobileNumber')?.value,
        address: this.maketransferForm.get('residentalAddress')?.value,
        dateOfBirth: this.maketransferForm.get('dob')?.value,
        nationalityDetailsId: this.maketransferForm.get('nationality')?.value,
        placeOfBirth: this.maketransferForm.get('placeOfBirth')?.value,
        clientCountryId: this.maketransferForm.get('country')?.value.countryId,
        isCoporateBeneficiary: false,
        agentSenderDetailsDto: {
          agentSenderDetailsId:
            this.dataService.senderData.agentSenderDetailsId,
        },
        isActive: true,
      };
      this.dataService.beneficiaryData = body;
      this.transferService
        .saveAgentBeneficiaryDetails(body)
        .subscribe((res: any) => {
          if (res['responseDto'] != null) {
            this.newBenId = res['responseDto']['id'];
            this.dataService.beneficiaryId = res['responseDto']['id'];
            this.senderDetailsResult = this.newBenId;

            this.isNewBeneficiary = true;

            if (res['responseDto']['id'] != null) {
              this.saveNewBankDetails();
            }

            if (res['responseDto']['msg']) {
              this.eventTriggerService.onReloadServiceData();
              this.createNotification(
                'success',
                'Success',
                res['responseDto']['msg'],
                '#ffffff',
                '#00A03E'
              );
            }
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
  }

  saveNewCoporateBeneficiary() {
    const body = {
      beneficiaryFirstName: this.maketransferForm.get('companyName')?.value,
      contactId: this.maketransferForm.get('code')?.value,
      mobileId: this.maketransferForm.get('code2')?.value,
      mobileNumber: this.maketransferForm.get('mobileNumber')?.value,
      contactNumber: this.maketransferForm.get('telephoneNumber')?.value,
      address: this.maketransferForm.get('residentalAddress')?.value,
      clientCountryId: this.maketransferForm.get('country')?.value.countryId,
      isCoporateBeneficiary: true,
      agentSenderDetailsDto: {
        agentSenderDetailsId: this.dataService.senderData.agentSenderDetailsId,
      },
      isActive: true,
    };
    this.dataService.beneficiaryData = body;
    this.transferService
      .saveAgentBeneficiaryDetails(body)
      .subscribe((res: any) => {
        if (res['responseDto'] != null) {
          this.newBenId = res['responseDto']['id'];
          this.dataService.beneficiaryId = res['responseDto']['id'];
          this.senderDetailsResult = this.newBenId;
          // this.getBeneficiaryDetailsById(this.dataService.beneficiaryId);
          this.isNewBeneficiary = true;

          if (res['responseDto']['id'] != null) {
            this.saveNewBankDetails();
          }

          if (res['responseDto']['message']) {
            this.eventTriggerService.onReloadServiceData();
            this.createNotification(
              'success',
              'Success',
              res['responseDto']['message'],
              '#ffffff',
              '#00A03E'
            );
          }
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

  getBankList(id: any = null) {
    const data: any = {};
    data['exposableId'] = this.dataService.agentExposableId;
    data['countryId'] =
      this.maketransferForm.get('country')?.value.clientCountryId;
    return this.transferService.getBankDetails(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.bankList = res['responseDto'];
        if (this.bankList != null) {
          this.isBankSl = true;
        }
      }
    });
  }

  getBankAccountsById(id: any = null) {
    this.dataService.selectedBankId = id;
    this.selectedBank = id.agentBeneficiaryBankAccountDetailsId;
    const data: any = {};
    data['agentBeneficiaryBankAccountDetailsId'] = this.dataService
      .selectedBankId.agentBeneficiaryBankAccountDetailsId
      ? this.dataService.selectedBankId.agentBeneficiaryBankAccountDetailsId
      : id;
    return this.transferService
      .getBankAccountDetailsById(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.selectedAccountDetails = res['responseDto'];
          this.dataService.selectBankAccount = res['responseDto'];
          this.disableBankFields();
        } else {
          this.selectedAccountDetails = null;
          this.createNotification(
            'error',
            'Input Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
        }
        // console.log(this.selectedAccountDetails);
        this.patchBankForm(this.selectedAccountDetails);
      });
  }

  beneficiaryTypeChange() {
    if (this.mySwitchValue == false) {
      this.maketransferForm.get('companyName')?.setValidators(null);
      this.maketransferForm.get('companyName')?.updateValueAndValidity();
      this.maketransferForm
        .get('firstName')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.characterLength('First Name', 25),
          ])
        );
      this.maketransferForm
        .get('lastName')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.characterLength('Last Name', 25),
          ])
        );
      this.maketransferForm.get('firstName')?.updateValueAndValidity();
      this.maketransferForm.get('lastName')?.updateValueAndValidity();
      this.maketransferForm.get('dob')?.setValidators([Validators.required]);
      this.maketransferForm.get('dob')?.updateValueAndValidity();
      this.maketransferForm
        .get('placeOfBirth')
        ?.setValidators([Validators.required]);
      this.maketransferForm.get('placeOfBirth')?.updateValueAndValidity();
      this.maketransferForm
        .get('placeOfBirth')
        ?.setValidators([Validators.required]);
      this.maketransferForm.get('nationality')?.setValidators(null);
      this.maketransferForm.get('nationality')?.updateValueAndValidity();

      this.maketransferForm.get('companyName')?.reset();
      this.maketransferForm.get('code')?.reset([]);
      this.maketransferForm.get('code2')?.reset([]);
      this.maketransferForm.get('telephoneNumber')?.reset([]);
      this.maketransferForm.get('mobileNumber')?.reset([]);
      this.maketransferForm.get('residentalAddress')?.reset([]);
    } else if (this.mySwitchValue == true) {
      this.maketransferForm
        .get('companyName')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.characterLength('Company Name', 25),
          ])
        );
      this.maketransferForm.get('companyName')?.updateValueAndValidity();
      this.maketransferForm.get('firstName')?.setValidators([]);
      this.maketransferForm.get('lastName')?.setValidators([]);
      this.maketransferForm.get('firstName')?.updateValueAndValidity();
      this.maketransferForm.get('lastName')?.updateValueAndValidity();
      this.maketransferForm.get('dob')?.setValidators([]);
      this.maketransferForm.get('dob')?.updateValueAndValidity();
      this.maketransferForm.get('placeOfBirth')?.setValidators([]);
      this.maketransferForm.get('placeOfBirth')?.updateValueAndValidity();
      this.maketransferForm.get('placeOfBirth')?.setValidators([]);
      this.maketransferForm.get('nationality')?.setValidators([]);
      this.maketransferForm.get('nationality')?.updateValueAndValidity();

      this.maketransferForm.get('firstName')?.reset();
      this.maketransferForm.get('lastName')?.reset([]);
      this.maketransferForm.get('dob')?.reset([]);
      this.maketransferForm.get('placeOfBirth')?.reset([]);
      this.maketransferForm.get('nationality')?.reset([]);
      this.maketransferForm.get('code')?.reset([]);
      this.maketransferForm.get('code2')?.reset([]);
      this.maketransferForm.get('telephoneNumber')?.reset([]);
      this.maketransferForm.get('mobileNumber')?.reset([]);
      this.maketransferForm.get('residentalAddress')?.reset([]);
    }
  }

  resetvalue() {
    this.maketransferForm.get('firstName')?.reset();
    this.maketransferForm.get('lastName')?.reset(null);
    this.maketransferForm.get('dob')?.reset(null);
    this.maketransferForm.get('placeOfBirth')?.reset(null);
    this.maketransferForm.get('nationality')?.reset(null);
    this.maketransferForm.get('code')?.reset(null);
    this.maketransferForm.get('code2')?.reset(null);
    this.maketransferForm.get('mobileNumber')?.reset(null);
    this.maketransferForm.get('telephoneNumber')?.reset(null);
    this.maketransferForm.get('residentalAddress')?.reset(null);
    this.maketransferForm.get('companyName')?.reset();
    this.maketransferForm.get('code')?.reset(null);
    this.maketransferForm.get('code2')?.reset(null);
    this.maketransferForm.get('mobileNumber')?.reset(null);
    this.maketransferForm.get('telephoneNumber')?.reset(null);
    this.maketransferForm.get('residentalAddress')?.reset(null);
  }

  getBankCodes() {
    const data: any = {};
    data['clientcurrencyid'] =
      this.maketransferForm.get('country')?.value.countryId;
    this.transferService.getBankCodes(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.receivingCountriesData = res['responseDto'];
        this.bankCodeInput = this.receivingCountriesData.bankCodeLabel
          ? true
          : false;
        this.swiftCodeInput = this.receivingCountriesData.swiftCodeLabel
          ? true
          : false;
        this.routingNumber = this.receivingCountriesData.routingNumberLabel
          ? true
          : false;
        this.IfsccodeLable = this.receivingCountriesData.label4 ? true : false;
        this.IbanCodeLable = this.receivingCountriesData.label5 ? true : false;
        this.BranchCodeLable = this.receivingCountriesData.label6
          ? true
          : false;
      }
      // console.log('curr', this.bankCodeInput);
      // console.log('curr2', this.swiftCodeInput);
      // console.log('curr3', this.routingNumber);
      this.addbankType();
    });
  }
  addbankType() {
    if (this.bankCodeInput) {
      this.maketransferForm
        .get('bankCode')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.exactLength('Bank Code', 3),
          ])
        );
      this.maketransferForm.get('bankCode')?.updateValueAndValidity();
    } else {
      this.maketransferForm.get('bankCode')?.setValidators(null);
      this.maketransferForm.get('bankCode')?.updateValueAndValidity();
    }

    if (this.swiftCodeInput) {
      this.maketransferForm
        .get('swiftCode')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.alphanumericPattern(8, 11),
          ])
        );
      this.maketransferForm.get('swiftCode')?.updateValueAndValidity();
    } else {
      this.maketransferForm.get('swiftCode')?.setValidators(null);
      this.maketransferForm.get('swiftCode')?.updateValueAndValidity();
    }

    if (this.routingNumber) {
      this.maketransferForm
        .get('routingNumber')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.exactLength('Routing Number', 9),
          ])
        );
      this.maketransferForm.get('routingNumber')?.updateValueAndValidity();
    } else {
      this.maketransferForm.get('routingNumber')?.setValidators(null);
      this.maketransferForm.get('routingNumber')?.updateValueAndValidity();
    }
    if (this.IfsccodeLable) {
      this.maketransferForm
        .get('label4')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.specificPattern(),
          ])
        );
      this.maketransferForm.get('label4')?.updateValueAndValidity();
    } else {
      this.maketransferForm.get('label4')?.setValidators(null);
      this.maketransferForm.get('label4')?.updateValueAndValidity();
    }

    if (this.IbanCodeLable) {
      this.maketransferForm
        .get('label5')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.alphanumericPattern(15, 34),
          ])
        );
      this.maketransferForm.get('label5')?.updateValueAndValidity();
    } else {
      this.maketransferForm.get('label5')?.setValidators(null);
      this.maketransferForm.get('label5')?.updateValueAndValidity();
    }
    if (this.BranchCodeLable) {
      this.maketransferForm
        .get('label6')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.exactLength('Branch Code', 5),
          ])
        );
      this.maketransferForm.get('label6')?.updateValueAndValidity();
    } else {
      this.maketransferForm.get('label6')?.setValidators(null);
      this.maketransferForm.get('label6')?.updateValueAndValidity();
    }

    if (this.isbankSl == 1) {
      this.maketransferForm
        .get('bankName')
        ?.setValidators([Validators.required]);
      this.maketransferForm.get('bankCode')?.setValidators(null);
      this.maketransferForm.get('bankName')?.updateValueAndValidity();
      this.maketransferForm.get('bankCode')?.updateValueAndValidity();
    } else if (this.isbankSl != 1) {
      this.maketransferForm
        .get('bankName')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            CustomValidators.alphanumericWithSpaces(5, 35),
          ])
        );
      this.maketransferForm.get('bankName')?.updateValueAndValidity();
    }
  }

  checkAlphabets(event: any) {
    let charCode = event.which || event.keyCode;
    let char = String.fromCharCode(charCode).toLowerCase();
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (alphabet.indexOf(char) === -1) {
      event.preventDefault();
    }
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  contactNumberValidation1() {
    if (this.maketransferForm.get('telephoneNumber')!.value) {
      let data = this.maketransferForm.get('telephoneNumber')!.value.charAt(0);
      let currentData = '';
      if (data === '0') {
        for (
          let i = 1;
          i < this.maketransferForm.get('telephoneNumber')!.value.length;
          i++
        ) {
          currentData =
            currentData +
            this.maketransferForm.get('telephoneNumber')!.value.charAt(i);
        }
      }
    }
  }
  disableBankFields() {
    this.maketransferForm.get('bankName')?.disable();
    this.maketransferForm.get('accName')?.disable();
    this.maketransferForm.get('branchName')?.disable();
    this.maketransferForm.get('supportCurrency')?.disable();
    this.maketransferForm.get('bankCode')?.disable();
    this.maketransferForm.get('routingNumber')?.disable();
    this.maketransferForm.get('swiftCode')?.disable();
    this.maketransferForm.get('label4')?.disable();
    this.maketransferForm.get('label5')?.disable();
    this.maketransferForm.get('label6')?.disable();
  }
  enableBankFields() {
    this.maketransferForm.get('bankName')?.enable();
    this.maketransferForm.get('accName')?.enable();
    this.maketransferForm.get('branchName')?.enable();
    // this.maketransferForm.get('supportCurrency')?.enable();
    this.maketransferForm.get('bankCode')?.enable();
    this.maketransferForm.get('routingNumber')?.enable();
    this.maketransferForm.get('swiftCode')?.enable();
    this.maketransferForm.get('label4')?.enable();
    this.maketransferForm.get('label5')?.enable();
    this.maketransferForm.get('label6')?.enable();
  }

  disabledDate = (current: NzSafeAny): boolean => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18); // set the maximum allowed date to 16 years ago
    return current > maxDate;
  };
  changeRef(other: any) {
    if (other.referenceCode == 'other') {
      this.provideReason = true;
      this.maketransferForm
        .get('referenceOther')
        ?.setValidators([Validators.required]);
      this.maketransferForm.get('referenceOther')?.updateValueAndValidity();
    } else {
      this.provideReason = false;
      this.maketransferForm.get('referenceOther')?.setValidators(null);
      this.maketransferForm.get('referenceOther')?.updateValueAndValidity();
    }
  }
}
