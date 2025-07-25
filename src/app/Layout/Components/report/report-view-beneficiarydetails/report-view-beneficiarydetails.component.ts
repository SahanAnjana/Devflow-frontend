import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';

import { CustomValidators } from 'src/app/_helpers/custom-validators';

import { CommonsService } from 'src/app/_services/commons.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';

@Component({
  selector: 'app-report-view-beneficiarydetails',
  templateUrl: './report-view-beneficiarydetails.component.html',
  styleUrls: ['./report-view-beneficiarydetails.component.sass'],
})
export class ReportViewBeneficiarydetailsComponent {
  isActive: any; //used
  countryData: any; //used
  bankDetails: any; //used

  // country: any;
  clientNames: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  // currency: any;
  nationality: any;
  currencie: any;
  currentUser: any;
  exposableId: any;
  bank: any;
  countryBankId = '';
  // bankname: any;
  countryname: any;
  bankdetails: any;
  countryDetails: any;
  currencies: any;
  countryCode: any;
  isCorporate: any;

  receivingCountriesData: any;
  bankCodeInput!: boolean;
  swiftCodeInput!: boolean;
  routingNumber!: boolean;
  beneficiaryView: any;
  showBankCode: any;
  isSwitchDisble = false;
  constructor(
    private formBuilder: FormBuilder,
    private report: ReportService,
    private tokenService: TokenserviceService,
    private commonservice: CommonsService,
    private notification: NzNotificationService,
    private modalRef: NzModalRef,
    private dataService: DataService,
    private eventriggerservice: EventTriggerService,
    private transferService: TransferTabService
  ) {
    this.currentUser = this.commonservice.parseJwt(
      this.tokenService.getToken()
    );
  }
  beneficiaryform!: UntypedFormGroup;
  ngOnInit() {
    const {
      required,
      customSelectorRequired,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = CustomValidators;

    this.beneficiaryform = this.formBuilder.group({
      firstname: ['', null],
      lastname: ['', null],
      companyname: ['', null],
      contactnumber: ['', null],
      mobilenumber: ['', null],
      address: ['', null],
      dateofbirth: ['', null],
      placeofbirth: ['', null],
      country: ['', null],
      bankname: ['', null],
      accountnumber: ['', null],
      branch: ['', null],
      currency: ['', null],
      ifsc: ['', null],
      swiftcode: ['', null],
      routingnumber: ['', null],
    });

    // this.beneficiaryform.patchValue({
    //   companyname: this.dataService.reportdata.beneficiaryFirstName,
    //   contactnumber: this.dataService.reportdata.beneficiaryContactNumber,
    //   mobilenumber: this.dataService.reportdata.beneficiaryMobileNumber,
    //   address: this.dataService.reportdata.beneficiaryAddress,
    //   bankname: this.dataService.reportdata.beneficiaryBankName,
    //   accountnumber: this.dataService.reportdata.beneficiaryAccountNumber,
    //   branch: this.dataService.reportdata.beneficiaryBankBranch,
    //   country: this.dataService.reportdata.beneficiaryCountry,
    //   currency: this.dataService.reportdata.recipientCurrency,
    // });
    this.beneficiaryform.patchValue({
      firstname: this.dataService.reportdata.beneficiaryFirstName,
      lastname: this.dataService.reportdata.beneficiaryLastName,
      companyname: this.dataService.reportdata.beneficiaryFirstName,
      contactnumber: this.dataService.reportdata.beneficiaryContactNumber,
      mobilenumber: this.dataService.reportdata.beneficiaryMobileNumber,
      address: this.dataService.reportdata.beneficiaryAddress,
      dateofbirth: this.dataService.reportdata.beneficiaryDateOfBirth,
      placeofbirth: this.dataService.reportdata.beneficiaryPlaceOfBirth,
      accountnumber: this.dataService.reportdata.beneficiaryAccountNumber,
      branch: this.dataService.reportdata.beneficiaryBankBranch,
      bankname: this.dataService.reportdata.beneficiaryBankName,
      ifsc: this.dataService.reportdata.beneficiaryBankCode,
      swiftcode: this.dataService.reportdata.beneficiarySwiftCode,
      routingnumber: this.dataService.reportdata.beneficiaryRoutingNumber,

      // country: this.dataService.reportdata.beneficiaryCountryId,
    });

    this.beneficiaryform.get('bankname')?.valueChanges.subscribe((value) => {
      this.dataService.reportdata.beneficiaryBankName = value;
      // console.log('check', this.dataService.reportdata.beneficiaryBankName);
    });

    this.getExposableId();
    this.getcountryname();
    this.getcountryname();
    this.getnationality();
    this.getClientNames();

    if (this.dataService.isBenEditable.isEditable == false) {
      this.companyname?.disable();
      this.firstname?.disable();
      this.lastname?.disable();
      this.contactnumber?.disable();
      this.mobilenumber?.disable();
      this.address?.disable();
      this.country?.disable();
      this.dateofbirth?.disable();
      this.placeofbirth?.disable();
      this.isSwitchDisble = true;
    }
    if (this.dataService.isBankEditable.isEditable == false) {
      this.bankname?.disable();
      this.accountnumber?.disable();
      this.branch?.disable();
      this.currency?.disable();
      this.ifsc?.disable();
      this.swiftcode?.disable();
      this.routingnumber?.disable();
    }

    this.isCorporate = this.dataService.reportdata.isCorporate;
  }

  get firstname() {
    return this.beneficiaryform.get('firstname');
  }
  get lastname() {
    return this.beneficiaryform.get('lastname');
  }
  get companyname() {
    return this.beneficiaryform.get('companyname');
  }
  get contactnumber() {
    return this.beneficiaryform.get('contactnumber');
  }
  get mobilenumber() {
    return this.beneficiaryform.get('mobilenumber');
  }
  get address() {
    return this.beneficiaryform.get('address');
  }
  get dateofbirth() {
    return this.beneficiaryform.get('dateofbirth');
  }
  get placeofbirth() {
    return this.beneficiaryform.get('placeofbirth');
  }
  get country() {
    return this.beneficiaryform.get('country');
  }
  get bankname() {
    return this.beneficiaryform.get('bankname');
  }
  get accountnumber() {
    return this.beneficiaryform.get('accountnumber');
  }
  get branch() {
    return this.beneficiaryform.get('branch');
  }

  get currency() {
    return this.beneficiaryform.get('currency');
  }
  get ifsc() {
    return this.beneficiaryform.get('ifsc');
  }
  get swiftcode() {
    return this.beneficiaryform.get('swiftcode');
  }
  get routingnumber() {
    return this.beneficiaryform.get('routingnumber');
  }
  getClientNames() {
    this.report.gettclientname().subscribe((res) => {
      this.clientNames = res['responseDto'];
      this.getcurrency(this.clientNames[0].clientCode);
      this.getcountryCode(this.clientNames[0].clientCode);

      // console.log('client 1', this.clientNames[0].clientCode);
    });
  }

  getcurrency(id: any) {
    const data: any = {};
    data['clientCode'] = id;
    this.report.getclientcurrentcy(data).subscribe((res: any) => {
      this.currencie = res['responseDto'];

      const beneficiaryCurrencyDetail =
        this.dataService.reportdata.recipientCurrency;
      const selectedCurrency = this.currencie.find(
        (cur: { currencyCode: any }) =>
          cur.currencyCode === beneficiaryCurrencyDetail
      );

      // this.beneficiaryform.patchValue({
      //   currency: selectedCurrency ? selectedCurrency.currencyId : null,
      // });
      this.beneficiaryform.patchValue({
        currency: this.dataService.reportdata.bankCurrencyId,
      });
      this.getAgentReceivingCountries(
        this.dataService.reportdata.bankCurrencyId
      );
    });
  }

  getcountryCode(id: any) {
    const data: any = {};
    data['clientCode'] = id;
    this.report.getcountry(data).subscribe((res: any) => {
      this.countryCode = res['responseDto'];
    });
  }

  getcountry() {
    this.report.getcountrycode().subscribe((res: any) => {
      this.countryDetails = res['responseDto'];

      const beneficiaryMobileCode =
        this.dataService.reportdata.beneficiaryMobileCode;
      const selectedMobileCode = this.countryDetails.find(
        (pho: { phonePrefix: any }) => pho.phonePrefix === beneficiaryMobileCode
      );

      this.dataService.contactId = selectedMobileCode.countryCodeId;
    });
  }

  getAgentReceivingCountries(currencyValue: any) {
    const data: any = {};
    data['clientcurrencyid'] = currencyValue;
    this.transferService
      .getAgentReceivingCountries(data)
      .subscribe((res: any) => {
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
        }
        console.log('curr', this.bankCodeInput);
        console.log('curr2', this.swiftCodeInput);
        console.log('curr3', this.routingNumber);
      });
  }
  getnationality() {
    this.report.getnationality().subscribe((res) => {
      this.nationality = res['responseDto'];

      const beneficiaryNationalityDetail =
        this.dataService.reportdata.userNationalityName;
      const selectedNationality = this.nationality.find(
        (nat: { nationality: any }) =>
          nat.nationality === beneficiaryNationalityDetail
      );
      // console.log('selectedNationality', selectedNationality);

      // this.beneficiaryform.patchValue({
      //   country: selectedNationality
      //     ? selectedNationality.nationalityDetailsId
      //     : null,
      // });
    });
  }

  // getCurrencies() {
  //   this.report.getcurrencies().subscribe((res: any) => {
  //     this.currencies = res['responseDto'];

  //     const beneficiaryCurrencyDetail =
  //       this.dataService.reportdata.recipientCurrency;
  //     const selectedCurrency = this.currencies.find(
  //       (cur: { currencyCode: any }) =>
  //         cur.currencyCode === beneficiaryCurrencyDetail
  //     );

  //     this.beneficiaryform.patchValue({
  //       bankname: this.dataService.reportdata.beneficiaryBankName,
  //       accountnumber: this.dataService.reportdata.beneficiaryAccountNumber,
  //       branch: this.dataService.reportdata.beneficiaryBankBranch,
  //       currency: selectedCurrency ? selectedCurrency.currencyId : null,
  //       swiftcode: null,
  //       ifsc: null,
  //     });
  //   });
  // }

  getExposableId() {
    const data: any = {};
    data['username'] = this.currentUser.sub;
    this.report
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['data'];
          // this.getcountryname(this.exposableId);
          // console.log('exposable id', this.exposableId);
        },
      });
  }
  getcountryname() {
    const data: any = {};
    data['exposeId'] = 'JVb3mfaNS29';
    this.report.getcountryname(data).subscribe((res: any) => {
      this.countryData = res['responseDto'];

      const beneficiaryCountry = this.dataService.reportdata.beneficiaryCountry;
      const selectedBenifisary = this.countryData?.find(
        (nat: { countryName: any }) => nat.countryName === beneficiaryCountry
      );

      this.beneficiaryform.patchValue({
        country: selectedBenifisary.countryId,
      });
    });
  }

  getbank(recevieddata: any) {
    const data: any = {};
    data['username'] = this.exposableId;
    data['countryId'] = recevieddata;

    // console.log('Received data', recevieddata);

    this.report.getbankdetails(data).subscribe((res: any) => {
      this.bankDetails = res['responseDto'];

      const beneficiaryBankName =
        this.dataService.reportdata.beneficiaryBankName;
      const selectedBankname = this.bankDetails?.find(
        (nat: { bankname: any }) => nat.bankname === beneficiaryBankName
      );

      // console.log('selectedBankname', selectedBankname);

      // this.beneficiaryform.patchValue({
      //   bankname: selectedBankname ? selectedBankname.bankname : null,
      // });
    });
  }

  handleButtonClick(): void {
    // This function will be executed when the button in the app-new component is clicked.
    // console.log('Button in app-new component clicked!');
  }

  updateUser() {
    // if (this.dataService.isBenEditable.isEditable === true) {
    //   if (
    //     this.dataService.reportdata.isCorporate === true &&
    //     this.dataService.isBankEditable.isEditable === true
    //   ) {
    //     this.updatecorpoate();
    //     this.updateBankDetails();
    //   } else {
    //     this.updateBenificary();
    //   }
    // }
    if (this.dataService.reportdata.isCorporate === true) {
      this.updatecorpoate();
      this.updateBankDetails();
    } else {
      this.updateBenificary();
      this.updateBankDetails();
    }
  }

  updateBenificary() {
    if (this.dataService.isBenEditable.isEditable === true) {
      const data = {
        agentBeneficiaryDetailsId:
          this.dataService.reportdata.agentBeneficiaryDetailsId,
        beneficiaryFirstName: this.firstname?.value,
        beneficiaryLastName: this.lastname?.value,
        contactId: 1,
        contactNumber: this.contactnumber?.value,
        mobileId: this.dataService.reportdata.mobileId,
        mobileNumber: this.mobilenumber?.value,
        address: this.address?.value,
        dateOfBirth: this.dateofbirth?.value,
        clientCountryId: this.country?.value,
        isCoporateBeneficiary: false,
        agentSenderDetailsDto: {
          agentSenderDetailsId:
            this.dataService.reportdata.agentSenderDetailsId,
        },
        // dateOfBirth: this.dataService.reportdata.beneficiaryDateOfBirth,
        isActive: true,
      };
      this.report.updateBeneficiary(data).subscribe(
        (res: any) => {
          if (res['responseDto']) {
            this.createNotification(
              'success',
              'Success',
              'Beneficiary Updated successfully',
              '#ffffff',
              '#00A03E'
            );
            this.closeModal();
            this.eventriggerservice.onReloadServiceData('getAllData');
          } else {
            this.createNotification(
              'error',
              'Error',
              res.errorDescription,
              '#ffffff',
              '#cc2d2d'
            );
          }
        },
        () => {
          this.createNotification(
            'error',
            'Error',
            'Update failed',
            '#ffffff',
            '#cc2d2d'
          );
        }
      );
    }
  }

  updatecorpoate() {
    if (this.dataService.isBenEditable.isEditable === true) {
      const data = {
        agentBeneficiaryDetailsId:
          this.dataService.reportdata.agentBeneficiaryDetailsId,
        beneficiaryFirstName: this.companyname?.value,
        contactId: this.dataService.reportdata.contactId,
        contactNumber: this.contactnumber?.value,
        mobileId: this.dataService.reportdata.mobileId,
        mobileNumber: this.mobilenumber?.value,
        address: this.address?.value,
        clientCountryId: this.country?.value,
        isCoporateBeneficiary: true,
        agentSenderDetailsDto: {
          agentSenderDetailsId:
            this.dataService.reportdata.agentSenderDetailsId,
        },
        isActive: true,
      };
      this.report.updateBeneficiary(data).subscribe(
        (res: any) => {
          if (res['responseDto']) {
            this.createNotification(
              'success',
              'Success',
              'Beneficiary Details Updated successfully',
              '#ffffff',
              '#00A03E'
            );
            this.eventriggerservice.onReloadServiceData('getAllData');
          } else {
            this.createNotification(
              'error',
              'Error',
              res.errorDescription,
              '#ffffff',
              '#cc2d2d'
            );
          }
        },
        () => {
          this.createNotification(
            'error',
            'Error',
            'Beneficiary Details Update failed',
            '#ffffff',
            '#cc2d2d'
          );
        }
      );
    }
  }
  updateBankDetails() {
    console.log('exposable id dataservice', this.dataService.exposableId);
    console.log('exposable id ', this.exposableId);
    if (this.dataService.isBankEditable.isEditable1 === true) {
      const data: any = {};
      data['exposableId'] = 'JVb3mfaNS29';
      data['agentTransactionDetailId'] =
        this.dataService.reportdata.agentTransactionDetailId;
      data['countryId'] = this.country?.value;

      const formData: any = {
        beneficiaryDetailsId:
          this.dataService.reportdata.agentBeneficiaryDetailsId,
        bankName: this.dataService.reportdata.beneficiaryBankName,
        branchName: this.branch?.value,
        accountNumber: this.accountnumber?.value,
        clientCurrencyId: this.currency?.value,
        swiftCode: this.swiftcode?.value,
        routingNumber: this.routingnumber?.value,
        bankCode: this.ifsc?.value,
      };
      this.report.updateBankAccountDetails(data, formData).subscribe(
        (res: any) => {
          if (res['responseDto']) {
            this.createNotification(
              'success',
              'Success',
              'Bank details Updated successfully',
              '#ffffff',
              '#00A03E'
            );
            this.eventriggerservice.onReloadServiceData('getAllData');
          } else {
            this.createNotification(
              'error',
              'Error',
              res.errorDescription,
              '#ffffff',
              '#cc2d2d'
            );
          }
        },
        () => {
          this.createNotification(
            'error',
            'Error',
            'Bank details Update failed',
            '#ffffff',
            '#cc2d2d'
          );
        }
      );
    }
  }

  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notification.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }

  closeModal() {
    this.modalRef.destroy();
  }

  // getClientNames() {
  //   this.report.gettclientname().subscribe((res) => {
  //     this.clientNames = res['responseDto'];
  //     this.getcurrency(this.clientNames[0].clientCode);
  //   });
  // }

  // getcurrency(id: any) {
  //   const data: any = {};
  //   data['clientCode'] = id;
  //   this.report.getclientcurrentcy(data).subscribe((res: any) => {
  //     this.currencie = res['responseDto'];
  //   });
  // }
}
