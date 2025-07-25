import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AgentService } from 'src/app/_services/agent.service';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-add-newbeneficiaries',
  templateUrl: './add-newbeneficiaries.component.html',
  styleUrls: ['./add-newbeneficiaries.component.sass'],
})
export class AddNewbeneficiariesComponent {
  //addnewbeneficiary!: FormGroup;

  addnewbeneficiary!: FormGroup;

  @Output() Gonext: EventEmitter<any> = new EventEmitter<any>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  exposableId: any;
  private searchNameData = new Subject<any>();
  nameVal: any;
  data$: any;
  searchResult: any;
  events: any;
  senderDetailsResult: any;
  agentDetails: any;
  customerFirstName: any;
  customerLastName: any;
  telephoneNo: any;
  handphoneNo: any;
  emails: any;
  residentialAddress: any;
  postCode: any;
  cityy: any;
  countryCodeValue: any;
  mobileCodeValue: any;
  nationalityValue: any;
  identityExpDate: any;
  identityModeValue: any;
  stateOrProvince: any;
  identityModeId: any;
  signUpCountryId: any;
  issueDate: any;
  senderId: any;
  nationalityDetails: any;
  countryDetails: any;
  idTypes: any;
  agentSenderDetailsId: any;
  allAgentDetails: any;
  agentEmail: any;
  selectEmailValueId: any;
  currentUser: any;
  identityType: any;

  ngOnInit() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;

    this.addnewbeneficiary = this.fb.group({
      Agent: [null],
      senderSearch: [null, [customRequired('Agent Customer')]],
      FilterBy: [null],
      SenderFirstName: [null, [customRequired('Sender First Name')]],
      SenderLastName: [null, [customRequired('Sender Last Name')]],
      LandlineNumber: [null, [customRequired('Landline Number')]],
      MobileNumber: [null, [customRequired('Mobile Number')]],
      Email: [null, [customRequired('Email')]],
      Address: [null, [customRequired('Address')]],
      City: [null],
      StateProvince: [null],
      Country: [null],
      Nationality: [null],
      IDType: [null, [customRequired('ID Type')]],
      IDNumber: [null, [customRequired('ID Number')]],
      IDExpDate: [null, [customRequired('ID Expiery Date')]],
    });

    // this.getExposableId();
    this.getNationality();
    this.disabledFields();
    this.getAgentDetails();
    this.dataService.saveAddBenifisaryData = null;
    this.patchValues();
  }

  patchValues() {
    this.addnewbeneficiary.patchValue({
      senderSearch: this.dataService.FirstPagesenderSearch,
      Agent: this.dataService.FirstPageAgntValue,
    });
    this.getChangeValue(this.dataService.FirstPageAgntValue);
  }

  get Agent() {
    return this.addnewbeneficiary.get('Agent');
  }
  get senderSearch() {
    return this.addnewbeneficiary.get('senderSearch');
  }
  get FilterBy() {
    return this.addnewbeneficiary.get('FilterBy');
  }
  get SenderFirstName() {
    return this.addnewbeneficiary.get('SenderFirstName');
  }
  get SenderLastName() {
    return this.addnewbeneficiary.get('SenderLastName');
  }
  get LandlineNumber() {
    return this.addnewbeneficiary.get('LandlineNumber');
  }
  get MobileNumber() {
    return this.addnewbeneficiary.get('MobileNumber');
  }
  get Email() {
    return this.addnewbeneficiary.get('Email');
  }
  get Address() {
    return this.addnewbeneficiary.get('Address');
  }
  get City() {
    return this.addnewbeneficiary.get('City');
  }
  get StateProvince() {
    return this.addnewbeneficiary.get('StateProvince');
  }
  get Country() {
    return this.addnewbeneficiary.get('Country');
  }
  get Nationality() {
    return this.addnewbeneficiary.get('Nationality');
  }
  get IDType() {
    return this.addnewbeneficiary.get('IDType');
  }
  get IDNumber() {
    return this.addnewbeneficiary.get('IDNumber');
  }
  get IDExpDate() {
    return this.addnewbeneficiary.get('IDExpDate');
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
    private agentService: AgentService
  ) {
    {
      this.currentUser = commonService.parseJwt(tokenService.getToken());
    }
  }

  disabledFields() {
    //this.addnewbeneficiary.get('Agent')?.disable();
    this.addnewbeneficiary.get('FilterBy')?.disable();
    this.addnewbeneficiary.get('SenderFirstName')?.disable();
    this.addnewbeneficiary.get('SenderLastName')?.disable();
    this.addnewbeneficiary.get('LandlineNumber')?.disable();
    this.addnewbeneficiary.get('MobileNumber')?.disable();
    this.addnewbeneficiary.get('Email')?.disable();
    this.addnewbeneficiary.get('Address')?.disable();
    this.addnewbeneficiary.get('City')?.disable();
    this.addnewbeneficiary.get('StateProvince')?.disable();
    this.addnewbeneficiary.get('Country')?.disable();
    this.addnewbeneficiary.get('Nationality')?.disable();
    this.addnewbeneficiary.get('IDType')?.disable();
    this.addnewbeneficiary.get('IDNumber')?.disable();
    this.addnewbeneficiary.get('IDExpDate')?.disable();
  }

  getExposableId(agentEmail: any) {
    const data: any = {};
    //data['username'] = 'clspotonagent@gmail.com';
    // data['username'] = 'admin@monex.org.uk'; //this.currentUser.sub;
    data['username'] = agentEmail;
    this.reportService
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['data'];
          // this.getAllSubAgentNames();
          // this.getRate();
          this.getCountries();
          //this.getExisitingBenificiaryDetails();
          //this.addNewBank()
          this.getIdTypes();
        },
        error: () => {},
      });
  }

  searchrxjs($event: any) {
    const value = $event;
    value ? this.searchNameData.next(value) : '';
    this.nameVal = value;
    this.dataService.nameValue = this.nameVal;
    if (value === '') {
      this.eventTriggerService.onReloadServiceData();
    }
  }

  searchSubscripe(email: any) {
    this.data$ = this.searchNameData
      .pipe(
        takeUntil(this.destroy$),
        // wait 300ms after each keystroke before considering the term
        debounceTime(600),
        // ignore new term if same as previous term
        distinctUntilChanged(),
        // ignore new term if fewer than 3 characters
        filter((term: string) => term.length >= 3),
        // switch to new search observable each time the term changes
        switchMap(async () => this.getAgentSenderDetailsByCriteria(email))
      )
      .subscribe((res: any) => {
        this.searchResult = res['responseDto'];
      });
  }

  getAgentSenderDetailsByCriteria(email: any) {
    console.log('filter', this.addnewbeneficiary.get('senderSearch')?.value);
    const data: any = {};
    data['agentsEmail'] = email;
    data['agentsId'] = this.Agent?.value;
    data['name'] = this.nameVal ? this.nameVal : '';
    this.benificiaryService.getAgentSenderName(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.searchResult = res['responseDto'];
        console.log('seach', this.addnewbeneficiary.get('senderSearch')?.value);
      }
    });
  }

  getAgentSenderDetailsAfterBack(email: any) {
    const data: any = {};
    data['agentsEmail'] = email;
    data['agentsId'] = this.Agent?.value;
    data['name'] = this.dataService.nameValue ? this.dataService.nameValue : '';
    this.benificiaryService.getAgentSenderName(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.searchResult = res['responseDto'];

        // this.getAgentSenderDetails();
      }
    });
  }

  onSearchSender($event: any) {
    this.events = $event.term;
  }

  onChangeSender(data: any) {
    if (data) {
      this.senderDetailsResult = data;
    }
    // this.senderListOpen = null;
    console.log('cust', this.searchResult);
  }

  getAgentSenderDetails() {
    const data: any = {};

    data['agentSenderDetailsId'] = this.senderSearch?.value; //this.sender?.value;

    this.benificiaryService
      .getAgentSenderDetails(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.agentDetails = res['responseDto'];
            this.customerFirstName = res['responseDto']['customerFirstName'];
            this.customerLastName = res['responseDto']['customerLastName'];
            this.telephoneNo = res['responseDto']['telephoneNo'];
            this.handphoneNo = res['responseDto']['handphoneNo'];
            this.emails = res['responseDto']['email'];
            this.residentialAddress = res['responseDto']['residentialAddress'];
            this.postCode = res['responseDto']['postCode'];
            this.cityy = res['responseDto']['city'];
            this.countryCodeValue = res['responseDto']['countryCodeId'];
            this.mobileCodeValue = res['responseDto']['countryCodeMobileId'];
            this.nationalityValue = res['responseDto']['nationalityDetailsId'];
            this.identityExpDate = res['responseDto']['identityExpDate'];
            this.identityModeValue = res['responseDto']['identityModeValue'];
            this.stateOrProvince = res['responseDto']['stateOrProvince'];
            this.identityModeId = res['responseDto']['identityModeId'];
            this.signUpCountryId = res['responseDto']['signUpCountryId'];
            this.issueDate = res['responseDto']['issueDate'];
            this.senderId = res['responseDto']['agentSenderDetailsId'];
            this.agentSenderDetailsId =
              res['responseDto']['agentSenderDetailsId'];
            this.identityType = res['responseDto']['identityType'];

            // this.dataService.issueDateId=this.issueDate
            // this.dataService.exsenderId=this.senderId

            //this.getVolumeSummary()

            console.log('dhfueihd', this.residentialAddress);

            this.addnewbeneficiary.patchValue({
              SenderFirstName: this.customerFirstName,
              SenderLastName: this.customerLastName,
              //landCode:this.countryCodeValue,
              LandlineNumber: this.telephoneNo,
              //mobileCode:this.mobileCodeValue,
              MobileNumber: this.handphoneNo,
              Email: this.emails,
              Address: res['responseDto']['residentialAddress'],
              City: this.cityy,
              StateProvince: 'ffddf', //this.stateOrProvince,
              Nationality: this.nationalityValue,
              //zip:this.postCode,
              IDType: this.identityType,
              IDNumber: this.identityModeValue,
              IDExpDate: this.identityExpDate,
              Country: this.signUpCountryId,
            });
          }
          this.dataService.countryId = this.signUpCountryId;
          this.dataService.agentSenderId = this.agentSenderDetailsId;
        },
      });
  }

  getNationality() {
    const data: any = {};

    this.benificiaryService
      .getNationality()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.nationalityDetails = res['responseDto'];
            //this.getAllRecievingCurrency()
            // this.getRate()
          }
          //console.log('hiiii', this.sendingCurrencyCode)
        },
      });
  }

  getCountries() {
    const data: any = {};

    data['exposableId'] = this.exposableId;

    this.benificiaryService
      .getCountries(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.countryDetails = res['responseDto'];
            //this.getAllRecievingCurrency()
            // this.getRate()
          }
          //console.log('hiiii', this.sendingCurrencyCode)
        },
      });
  }

  getIdTypes() {
    const data: any = {};

    data['exposableId'] = this.exposableId;

    this.benificiaryService
      .getIdTypes(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.idTypes = res['responseDto'];
            //this.getAllRecievingCurrency()
            // this.getRate()
          }
          //console.log('idTypes', this.idTypes)
        },
      });
  }

  validateForm() {
    if (
      this.addnewbeneficiary.get('senderSearch')?.value != null ||
      this.addnewbeneficiary.get('Agent')?.value != null
    ) {
      this.Gonext.emit();
      (this.dataService.FirstPageAgntValue =
        this.addnewbeneficiary.get('Agent')?.value),
        (this.dataService.FirstPagesenderSearch =
          this.addnewbeneficiary.get('senderSearch')?.value);
    } else {
      this.notificationService.create(
        'error',
        'Input Error',
        'Please Search Agent & Agent Customer',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    }
  }

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.addnewbeneficiary.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.notificationService.create(
            'error',
            'Input Error',
            ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getAgentDetails() {
    this.benificiaryService
      .getAgentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.allAgentDetails = res['responseDto'];
            this.dataService.saveAllAgentDetails = res['responseDto'];
            //this.getAllRecievingCurrency()
            // this.getRate()con
          }
          //console.log('idTypes', this.idTypes)
        },
      });
  }

  getChangeValue(value: any) {
    if (this.allAgentDetails) {
      const selectEmailValue = this.allAgentDetails?.find(
        (emailValue: any) => emailValue.agentDetailId === value
      );
      if (selectEmailValue) {
        this.selectEmailValueId = selectEmailValue.agentEmail;
      }
      this.searchSubscripe(this.selectEmailValueId);
    } else {
      const selectEmailValue = this.dataService.saveAllAgentDetails?.find(
        (emailValue: any) => emailValue.agentDetailId === value
      );
      if (selectEmailValue) {
        this.selectEmailValueId = selectEmailValue.agentEmail;
      }
    }
  }

  getagentDetailsId(value: any) {
    this.getAgentDetailsByagentDetailsId(value);
    this.getAgentSenderDetailsAfterBack(this.selectEmailValueId);
  }
  getAgentDetailsByagentDetailsId(agentDetailsId: any) {
    const data: any = {};

    data['agentDetailsId'] = agentDetailsId;
    this.agentService
      .getAgentDetailsByagentDetailsId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.getExposableId(
              res['responseDto']['agentDetailsDto']['agentEmail']
            );

            this.dataService.agentEmailSelectBenefit =
              res['responseDto']['agentDetailsDto']['agentEmail'];
          }
        },
      });
  }
}
