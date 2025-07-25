import { Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { MyValidators } from 'src/app/validators/custom-validators';
import { ViewBeneficiariesBasicDetailsComponent } from '../view-beneficiaries-basic-details/view-beneficiaries-basic-details.component';
import { ReportService } from 'src/app/_services/report.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { AgentService } from 'src/app/_services/agent.service';

@Component({
  selector: 'app-view-beneficiaries-account-details',
  templateUrl: './view-beneficiaries-account-details.component.html',
  styleUrls: ['./view-beneficiaries-account-details.component.sass'],
})
export class ViewBeneficiariesAccountDetailsComponent {
  switchValue = false;
  benificiaryaccountDetails!: FormGroup;
  @Input() incomingSelectedBeniId: any = {};

  @ViewChild(ViewBeneficiariesBasicDetailsComponent)
  ViewBeneficiariesData!: ViewBeneficiariesBasicDetailsComponent;

  destroy$: Subject<boolean> = new Subject<boolean>();
  pageNumber = 1;
  pageSize = 10;
  totalRecords: any;
  bankDetails: any;
  currentPageIndex = 1;
  exposableId: any;
  countryId: any;
  countryDetails: any;
  bankCodeLabel: any;
  swiftCodeLabel: any;
  referenceCountryCode: any;
  currencyDetails: any;
  countryName: any;
  currentUser: any;
  bankCodeLabeles: any;
  swiftCodeLabeles: any;
  dCountryId: any;
  showBankCodeField = false;
  showSwiftCodeField = false;
  showRoutingNumber = false;
  showIfsc = false;
  showIban = false;
  showBranchCode = false;
  fieldValid = true;
  countryDetailss: any;
  bankCode1: any;
  bankNameDetails: any;
  rountingNumber: any;
  label4: any;
  label5: any;
  label6: any;

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private benificiaryService: BenificiaryService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder,
    public modalRef: NzModalRef,
    private reportService: ReportService,
    private transferService: TransferTabService,
    private agentService: AgentService
  ) {
    {
      this.currentUser = commonService.parseJwt(tokenService.getToken());
    }
  }

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

    this.benificiaryaccountDetails = this.fb.group({
      country: [null, [Validators.required]],
      bankName: [null, [Validators.required]],
      accountNumber: [
        null,
        [Validators.compose([Validators.required, maxLength(30)])],
      ],
      branchName: [
        null,
        [
          Validators.compose([
            Validators.required,
            CustomValidators.alphanumericWithSpaces(5, 35),
          ]),
        ],
      ],
      currency: [null, [Validators.required]],
      bankCode: [null, null],
      swiftCode: [null, [Validators.required]],
      routingNumber: [null, [Validators.required]],
      ifsc: [null, [Validators.required]],
      iban: [null, [Validators.required]],
      branchCode: [null, [Validators.required]],
    });

    // this.benificiaryaccountDetails = new FormGroup({
    //   country: new FormControl(null, Validators.required),
    //   bankName: new FormControl(null, Validators.required),
    //   accountNumber: new FormControl(null, Validators.required),
    //   branchName: new FormControl(null, Validators.required),
    //   currency: new FormControl(null, Validators.required),
    //   bankCode: new FormControl(null, Validators.required),
    //   swiftCode: new FormControl(null, Validators.required),
    // });

    this.getBenificieryBankAccoutDetails();
    // this.getExposableId();
    console.log('okayyy', this.dataService.beniCountryId);
    this.getBasicData();
    this.getBenificieryCurrencies();
    //this.getBenificieryCountries()
    //console.log('plz come coutry id', this.dataService.beniCountryId);
  }

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.benificiaryaccountDetails.controls).forEach(
      (field: any) => {
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
      }
    );
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'country': {
        return 'Country';
      }
      case 'bankName': {
        return 'Bank Name';
      }
      case 'accountNumber': {
        return 'Account Number';
      }
      case 'branchName': {
        return 'Branch Name';
      }
      case 'currency': {
        return 'Currency';
      }
      case 'bankCode': {
        return 'Bank Code';
      }
      case 'swiftCode': {
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

  get country() {
    return this.benificiaryaccountDetails.get('country');
  }
  get bankName() {
    return this.benificiaryaccountDetails.get('bankName');
  }
  get accountNumber() {
    return this.benificiaryaccountDetails.get('accountNumber');
  }
  get branchName() {
    return this.benificiaryaccountDetails.get('branchName');
  }
  get currency() {
    return this.benificiaryaccountDetails.get('currency');
  }
  get bankCode() {
    return this.benificiaryaccountDetails.get('bankCode');
  }
  get swiftCode() {
    return this.benificiaryaccountDetails.get('swiftCode');
  }
  get routingNumber() {
    return this.benificiaryaccountDetails.get('routingNumber');
  }
  get ifsc() {
    return this.benificiaryaccountDetails.get('ifsc');
  }
  get iban() {
    return this.benificiaryaccountDetails.get('iban');
  }
  get branchCode() {
    return this.benificiaryaccountDetails.get('branchCode');
  }

  add() {
    console.log(this.benificiaryaccountDetails);
  }

  getBasicData() {
    const data: any = {};

    data['benificiaryid'] = this.incomingSelectedBeniId;
    this.benificiaryService
      .getBasicData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.countryId = res['responseDto']['countryId'];
            this.getAgentDetailsByagentDetailsId(
              res['responseDto']['agentDetailsId']
            );

            //this.dataService.beniCountryId=this.countryId
          }

          //this.dataService.beniCountryId=this.countryId
          //this.getBenificieryCountries()
        },
      });
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
          }
        },
      });
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
          this.getcountryname();
          //this.getExisitingBenificiaryDetails();
          //this.addNewBank()
          console.log('working', this.exposableId);
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  getBenificieryBankAccoutDetails() {
    const data: any = {};

    data['benificiaryId'] = this.incomingSelectedBeniId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.benificiaryService
      .getAllBankAccountDetails(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.bankDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.bankDetails = [];
            this.totalRecords = 0;
          }
        },
      });
  }

  toggleSwitch(receivedData: any) {
    const data: any = {};

    data['agentBeneficiaryId'] =
      receivedData.agentBeneficiaryBankAccountDetailsId;
    data['isActive'] = !receivedData.isActive;

    //console.log('beniId', this.benificiaryDetailsId);

    this.benificiaryService.updateBankAccountStatus(data).subscribe(
      (res: any) => {
        if (res['status'] == true) {
          this.notificationService.create(
            'success',
            'Success',
            'Agent Beneficiary Bank Status Updated.',
            { nzStyle: { background: '#00A03E', color: '#ffff' } }
          );
        }
        this.getBenificieryBankAccoutDetails();
      },
      () => {
        this.notificationService.create(
          'error',
          'Error',
          'Agent Benificiery Bank Status Updating Failed',
          { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
        );
      }
    );
  }

  getBenificieryCurrencies() {
    const data: any = {};

    data['refCode'] = 'MN'; //this.referenceCountryCode

    this.benificiaryService
      .getBneificieryCurrency(data)
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
      this.swiftCode?.setValidators(null);
      this.swiftCode?.updateValueAndValidity();
    }

    if (!this.benificiaryaccountDetails.valid) {
      this.validateAllFormFields(this.benificiaryaccountDetails);
      return;
    }

    const data: any = {};
    data['exposableId'] = this.exposableId;
    data['currencyID'] = this.country?.value; //this.dataService.countryId

    const formData = {
      bankName:
        this.bankCode1 == 1
          ? this.bankName?.value.bankname
          : this.bankName?.value,
      branchName: this.branchName?.value,
      beneficiaryDetailsId: this.incomingSelectedBeniId,
      accountNumber: this.accountNumber?.value,
      isActive: false,
      //BankCode:this.ba?.value,
      clientCurrencyId: this.currency?.value,
      countryId: this.country?.value,
      bankCode:
        this.bankCode1 == 1
          ? this.bankName?.value.bankCode
          : this.bankCode?.value
          ? this.bankCode?.value
          : undefined,
      swiftCode: this.swiftCode?.value ? this.swiftCode?.value : undefined,
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
          this.benificiaryaccountDetails.reset();
          this.getBenificieryBankAccoutDetails();
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];

          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#CC2D2D', color: '#fff' },
          });
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

  getCountries() {
    const data: any = {};

    data['exposableId'] = this.exposableId;

    this.benificiaryService
      .getCountries(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.countryDetailss = res['responseDto'];
            //this.getAllRecievingCurrency()
            // this.getRate()
          }
          //console.log('hiiii', this.sendingCurrencyCode)
        },
      });
  }

  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    // console.log('createNotification');
    // title: string, message: string
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }

  close() {
    this.modalRef.close();
  }

  getDynamicLabels(id: number) {
    this.getbank(id);
    const data: any = {};
    data['countryID'] = this.country?.value;
    this.bankCode1 = id;
    console.log('bankcode', this.bankCode1);

    this.benificiaryService
      .getDynamicLabels(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.bankCodeLabeles = res['responseDto']['bankCodeLabel'];
            this.swiftCodeLabeles = res['responseDto']['swiftCodeLabel'];
            this.rountingNumber = res['responseDto']['routingNumberLabel'];
            this.label4 = res['responseDto']['label4'];
            this.label5 = res['responseDto']['label5'];
            this.label6 = res['responseDto']['label6'];
            this.dCountryId = res['responseDto']['countryId'];

            if (this.bankCodeLabeles === 'Bank Code') {
              this.showBankCodeField = true;
            } else {
              this.showBankCodeField = false;
            }
            if (this.swiftCodeLabeles === 'Swift Code') {
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
      this.bankCode!.setValidators([]);
      this.bankCode!.updateValueAndValidity();
      this.swiftCode!.setValidators(null);
      this.swiftCode!.updateValueAndValidity();
    } else if (this.showBankCodeField === true) {
      this.bankCode!.setValidators(null);
      this.bankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.ifsc!.setValidators(null);
      this.ifsc!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
      this.swiftCode!.setValidators(null);
      this.swiftCode!.updateValueAndValidity();
    } else if (this.showIfsc === true) {
      this.ifsc!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.specificPattern(),
        ])
      );
      this.ifsc!.updateValueAndValidity();
      this.bankCode!.setValidators(null);
      this.bankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
      this.swiftCode!.setValidators(null);
      this.swiftCode!.updateValueAndValidity();
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
      this.bankCode!.setValidators(null);
      this.bankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
      this.swiftCode!.setValidators(null);
      this.swiftCode!.updateValueAndValidity();
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
      this.bankCode!.setValidators(null);
      this.bankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
      this.swiftCode!.setValidators(null);
      this.swiftCode!.updateValueAndValidity();
    } else if (this.showSwiftCodeField === true) {
      this.swiftCode!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.alphanumericPattern(8, 11),
        ])
      );
      this.swiftCode!.updateValueAndValidity();
      this.branchCode!.setValidators(null);
      this.branchCode!.updateValueAndValidity();
      this.routingNumber!.setValidators(null);
      this.routingNumber!.updateValueAndValidity();
      this.ifsc!.setValidators(null);
      this.ifsc!.updateValueAndValidity();
      this.bankCode!.setValidators(null);
      this.bankCode!.updateValueAndValidity();
      this.iban!.setValidators(null);
      this.iban!.updateValueAndValidity();
    }
  }

  swiftCodeValidation() {
    if (this.showSwiftCodeField === true) {
      this.swiftCode!.setValidators(
        Validators.compose([
          Validators.required,
          CustomValidators.alphanumericPattern(8, 11),
        ])
      );
      this.swiftCode!.updateValueAndValidity();
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  letterOnly(event: any): boolean {
    const separator = /^[a-zA-Z\s]*$/;
    return separator.test(event.key);
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;

    this.getBenificieryBankAccoutDetails();
  }
  getbank(recevieddata: any) {
    const data: any = {};
    data['username'] = 'JVb3mfaNS29';
    data['countryId'] = recevieddata;

    // console.log('Received data', recevieddata);

    this.reportService.getbankdetails(data).subscribe((res: any) => {
      this.bankNameDetails = res['responseDto'];
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
