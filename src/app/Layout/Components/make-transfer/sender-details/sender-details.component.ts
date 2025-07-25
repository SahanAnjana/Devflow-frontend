import { Component } from '@angular/core';
import { Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from 'rxjs';
import { differenceInCalendarDays, format } from 'date-fns';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

import { EventtriggerService } from 'src/app/_services/eventtrigger.service';

@Component({
  selector: 'app-sender-details',
  templateUrl: './sender-details.component.html',
  styleUrls: ['./sender-details.component.sass'],
})
export class SenderDetailsComponent {
  @Input() formGroupName!: string;
  maketransferForm!: FormGroup;
  public makeTransfrFlow2!: FormGroup;
  isSenderNotAvailable = false;
  isButtonClicked = false;
  countryCodeData: any;
  nationalityData: any;
  exposableId: any;
  countryData: any;
  agentIdentityData: any;
  private searchNameData = new Subject<any>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  data$: any;
  senderDetailsResult: any;
  nameVal: any;
  searchResult: any;
  senderData: any;
  agentAvailableData: any;
  newAgentSenderId: any;
  transactionSummaryData: any;
  summaryCcyCode: any;
  isFuture: any;

  constructor(
    private rootFormFroup: FormGroupDirective,
    private transferService: MakeTransferService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService,
    private reportService: ReportService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.exposableId = this.dataService.agentExposableId;
    this.maketransferForm = this.rootFormFroup.control.get(
      this.formGroupName
    ) as FormGroup;
    // console.log('senderDetails', this.senderDetailsGroup);
    // this.disableformCountrole();
    this.getCountryCodeforPhone();
    this.getNationality();
    this.getAllCountries();
    this.getAgentIdentityMode();
    this.searchSubscripe();
    this.disabledFields();
    this.maketransferForm.get('searchSender')?.enable();

    if (this.dataService.senderData != null) {
      // console.log(this.dataService.senderData);
      this.getSenderDetails(this.dataService.senderData.agentSenderDetailsId);
      this.getTransactionVolume();
    }
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'clearForms') {
          this.clearFields();
        }
      },
    });
  }
  disabledFields() {
    this.maketransferForm.get('firstName')?.disable();
    this.maketransferForm.get('lastName')?.disable();
    this.maketransferForm.get('codePhone')?.disable();
    this.maketransferForm.get('codeMobile')?.disable();
    this.maketransferForm.get('landLineNumber')?.disable();
    this.maketransferForm.get('mobileNumber')?.disable();
    this.maketransferForm.get('email')?.disable();
    this.maketransferForm.get('residentalAddress')?.disable();
    this.maketransferForm.get('city')?.disable();
    this.maketransferForm.get('state')?.disable();
    this.maketransferForm.get('country')?.disable();
    this.maketransferForm.get('postalCode')?.disable();
  }
  enableFields() {
    this.maketransferForm.get('firstName')?.enable();
    this.maketransferForm.get('lastName')?.enable();
    this.maketransferForm.get('codePhone')?.enable();
    this.maketransferForm.get('codeMobile')?.enable();
    this.maketransferForm.get('landLineNumber')?.enable();
    this.maketransferForm.get('mobileNumber')?.enable();
    this.maketransferForm.get('email')?.enable();
    this.maketransferForm.get('residentalAddress')?.enable();
    this.maketransferForm.get('city')?.enable();
    this.maketransferForm.get('state')?.enable();
    this.maketransferForm.get('country')?.enable();
    this.maketransferForm.get('postalCode')?.enable();
  }
  createSender() {
    this.eventTriggerService.onReloadServiceData('senderChanged');
    this.maketransferForm.get('searchSender')?.disable();
    this.dataService.senderData = null;
    this.isSenderNotAvailable = true;
    this.summaryCcyCode = null;
    this.transactionSummaryData = null;
    this.enableFields();
    this.maketransferForm.patchValue({
      searchSender: null,
      firstName: null,
      lastName: null,
      codePhone: null,
      codeMobile: null,
      landLineNumber: null,
      email: null,
      residentalAddress: null,
      city: null,
      state: null,
      country: null,
      nationality: null,
      postalCode: null,
      idType: null,
      idNumber: null,
      mobileNumber: null,
      idexpireDate: null,
    });
  }
  clearFields() {
    this.maketransferForm.patchValue({
      searchSender: null,
      firstName: null,
      lastName: null,
      codePhone: null,
      codeMobile: null,
      landLineNumber: null,
      email: null,
      residentalAddress: null,
      city: null,
      state: null,
      country: null,
      nationality: null,
      postalCode: null,
      idType: null,
      idNumber: null,
      mobileNumber: null,
      idexpireDate: null,
    });
  }
  getExposableID(userName: any) {
    const data: any = {};
    data['username'] = userName;
    this.reportService
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['data'];
          this.dataService.agentExposableId = this.exposableId;
        },
      });
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
  getAllCountries() {
    const data: any = {};
    data['exposableId'] = this.exposableId; //this.dataService.agentExposableId;
    this.transferService.getAllSignUpCountries(data).subscribe((res) => {
      if (res['responseDto']) {
        this.countryData = res['responseDto'];
      } else {
        this.countryData = [];
      }
    });
  }

  getAgentIdentityMode() {
    const data: any = {};
    data['exposableId'] = this.exposableId; //this.dataService.agentExposableId;
    this.transferService.getAgentIdentityMode(data).subscribe((res) => {
      if (res['responseDto']) {
        this.agentIdentityData = res['responseDto'];
      } else {
        this.agentIdentityData = [];
      }
    });
  }

  searchrxjs($event: any) {
    const value = $event;
    value ? this.searchNameData.next(value) : '';
    this.nameVal = value;
    if (value === '') {
      this.eventTriggerService.onReloadServiceData();
    }
  }
  onChangeSender(data: any) {
    this.eventTriggerService.onReloadServiceData('senderChanged');
    if (data) {
      this.senderDetailsResult = data;
    }
  }
  searchSubscripe() {
    this.data$ = this.searchNameData
      .pipe(
        takeUntil(this.destroy$),
        // wait 300ms after each keystroke before considering the term
        debounceTime(500),
        // ignore new term if same as previous term
        distinctUntilChanged(),
        // ignore new term if fewer than 3 characters
        filter((term: string) => term.length >= 3),
        // switch to new search observable each time the term changes
        switchMap(async () => this.getAgentSenderSearch())
      )
      .subscribe((res: any) => {});
  }

  getAgentSenderSearch() {
    const data: any = {};
    data['name'] = this.nameVal;
    data['email'] = this.dataService.agentEmail;
    data['agentDetailId'] = this.dataService.agentId;
    this.transferService.getAgentSender(data).subscribe((res) => {
      if (res['responseDto']) {
        this.searchResult = res['responseDto'];
      } else {
        this.searchResult = '';
      }
    });
  }

  patchForm(data: any) {
    this.dataService.senderData = data;
    this.getSenderDetails();
    this.getExposableID(data.email);
    this.getTransactionVolume();
  }

  getSenderDetails(id: any = null) {
    const data: any = {};
    data['agentSenderDetailsId'] = this.dataService.senderData
      ? this.dataService.senderData.agentSenderDetailsId
      : id;

    this.transferService.getAgentSenderbyId(data).subscribe((res) => {
      if (res['responseDto']) {
        this.senderData = res['responseDto'];
        this.dataService.senderData = res['responseDto'];
        // console.log('selected Sender data', this.senderData);
      } else {
        this.senderData = '';
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
      this.maketransferForm.patchValue({
        firstName: this.senderData.customerFirstName,
        lastName: this.senderData.customerLastName,
        codePhone: this.senderData.countryCodeId,
        codeMobile: this.senderData.countryCodeMobileId,
        landLineNumber: this.senderData.telephoneNo,
        email: this.senderData.email,
        residentalAddress: this.senderData.residentialAddress,
        city: this.senderData.city,
        state: this.senderData.stateOrProvince,
        country: this.senderData.signUpCountryId,
        nationality: this.senderData.nationalityDetailsId,
        postalCode: this.senderData.postCode,
        idType: this.senderData.identityModeId,
        idNumber: this.senderData.identityModeValue,
        mobileNumber: this.senderData.handphoneNo,
        idexpireDate: this.senderData.identityExpDate,
      });
    });
  }
  getsender() {
    if (
      this.maketransferForm.get('firstName')?.value &&
      this.maketransferForm.get('lastName')?.value &&
      this.maketransferForm.get('landLineNumber')?.value &&
      this.maketransferForm.get('mobileNumber')?.value != null &&
      this.senderData == null
    ) {
      this.getSenderbySearch();
    }
  }
  getSenderbySearch() {
    const data: any = {};
    data['exposableId'] = this.exposableId;
    data['firstName'] = this.maketransferForm.get('firstName')?.value;
    data['lastName'] = this.maketransferForm.get('lastName')?.value;
    data['telephoneNumber'] =
      this.maketransferForm.get('landLineNumber')?.value;
    data['handPhoneNumber'] = this.maketransferForm.get('mobileNumber')?.value;
    this.transferService
      .getAgentSenderDuplicateSearch(data)
      .subscribe((res) => {
        if (res['responseDto']) {
          this.agentAvailableData = res['responseDto'];
          if (this.agentAvailableData.isAvailable == true) {
            this.getSenderDetails(this.agentAvailableData.agentSenderDetailsId);
          }
        } else {
          this.agentAvailableData = '';
          // this.createNotification(
          //   'error',
          //   'Input Error',
          //   res['errorDescription'],
          //   '#ffffff',
          //   '#cc2d2d'
          // );
        }
      });
  }

  patchSenderForm(data: any) {
    // console.log(data);

    this.maketransferForm.patchValue({
      firstName: data.customerFirstName,
      lastName: data.customerLastName,
      codePhone: data.countryCodeId,
      codeMobile: data.countryCodeMobileId,
      landLineNumber: data.telephoneNo,
      email: data.email,
      residentalAddress: data.residentialAddress,
      city: data.city,
      state: data.stateOrProvince,
      country: data.countryCodeId,
      nationality: data.nationalityDetailsId,
      postalCode: data.postCode,
      idType: data.identityModeId,
      idNumber: data.identityModeValue,
      mobileNumber: data.handphoneNo,
      idexpireDate: format(data.identityExpDate, 'yyyy-MM-dd'),
    });
  }

  saveSender() {
    const data = {
      customerFirstName: this.maketransferForm.get('firstName')?.value,
      customerLastName: this.maketransferForm.get('lastName')?.value,
      telephoneNo: this.maketransferForm.get('landLineNumber')?.value,
      handphoneNo: this.maketransferForm.get('mobileNumber')?.value,
      email: this.maketransferForm.get('email')?.value,
      residentialAddress: this.maketransferForm.get('residentalAddress')?.value,
      // dateOfBirth: this.maketransferForm.get('firstName')?.value,
      postCode: this.maketransferForm.get('postalCode')?.value,
      city: this.maketransferForm.get('city')?.value,
      agentDetailsId: 1,
      registeredFrom: 'AGENT_PORTAL',
      stateOrProvince: this.maketransferForm.get('state')?.value,
      signUpCountryId: this.maketransferForm.get('country')?.value,
      countryCodeId: this.maketransferForm.get('codePhone')?.value,
      countryCodeMobileId: this.maketransferForm.get('codeMobile')?.value,
      nationalityDetailsId: this.maketransferForm.get('nationality')?.value,
      placeOfBirth: this.maketransferForm.get('city')?.value,
      countryId: this.maketransferForm.get('codePhone')?.value,
      isCooperateEnable: false,
      identityModeValue: this.maketransferForm.get('idNumber')?.value,
      identityExpDate: format(
        this.maketransferForm.get('idexpireDate')?.value,
        'yyyy-MM-dd'
      ),
      identityModeId: this.maketransferForm.get('idType')?.value,
    };
    this.transferService.saveAgentSender(data).subscribe((res: any) => {
      if (res['responseDto'] != null) {
        if (res['responseDto']['id']) {
          this.newAgentSenderId = res['responseDto']['id'];
          this.eventTriggerService.onReloadServiceData();
          this.getSenderDetails(this.newAgentSenderId);
          this.isSenderNotAvailable = false;
          this.eventTriggerService.onReloadServiceData('nextStep');
          this.createNotification(
            'success',
            'Success',
            'Sender details Added successfully',
            '#ffffff',
            '#00A03E'
          );
        } else {
          this.createNotification(
            'error',
            'Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
        }
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

  getTransactionVolume() {
    const data: any = {};
    data['agentSenderDetailId'] =
      this.dataService.senderData.agentSenderDetailsId;
    data['sendingCurrencyCode'] =
      this.dataService.sendingCurrencyData.currencyCode;
    this.transferService
      .getAgentTransactionVolumeSummary(data)
      .subscribe((res) => {
        if (res['responseDto']) {
          this.transactionSummaryData =
            res['responseDto']['0']['customerVolumeDetailsDtos'];
          this.summaryCcyCode = res['responseDto']['0'];
          // console.log(this.transactionSummaryData);
        } else {
          this.transactionSummaryData = '';
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

  date() {
    // console.log(this.maketransferForm.get('idexpireDate')?.value);
    this.validateExpDate();
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) < 0;

  isFutureDate(dateString: string): boolean {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    return inputDate >= currentDate;
  }
  validateExpDate() {
    this.isFuture = this.isFutureDate(
      this.maketransferForm.get('idexpireDate')?.value
    );
  }
}
