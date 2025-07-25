import { Component, Input, Optional } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.sass'],
})
export class BeneficiaryDetailsComponent {
  @Input() formGroupName!: string;
  public beneficiaryDetailsGroupForm!: FormGroup;

  switchValue = false;
  isPersonal = false;
  mySwitchValue = false;
  codeDetails: any;
  nationalityData: any;
  countryCodeDetails: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  countryData: any;
  beneficiary: any;
  currencyDetails: any;
  tableData: any;
  transactionSummaryData: any;
  summaryCcyCode: any;
  receivingCountriesData: any;
  bankCodeInput!: boolean;
  swiftCodeInput!: boolean;
  routingNumber!: boolean;
  isIfsc!: boolean;
  isIban!: boolean;
  isBranchCode!: boolean;
  beneficiaryView: any;
  showBankCode: any;
  constructor(
    private rootFormFroup: FormGroupDirective,
    private transferService: TransferTabService,
    private dataservice: DataService,
    private notification: NzNotificationService
  ) {
    this.getCountryCode();
    this.getAllNationalityDetails();
  }
  get CompanyName() {
    return this.beneficiaryDetailsGroupForm.get('CompanyName');
  }
  get contactNumber() {
    return this.beneficiaryDetailsGroupForm.get('contactNumber');
  }
  get MobileNumber() {
    return this.beneficiaryDetailsGroupForm.get('MobileNumber');
  }
  get address() {
    return this.beneficiaryDetailsGroupForm.get('address');
  }
  get bankname() {
    return this.beneficiaryDetailsGroupForm.get('bankname');
  }
  get bankCode() {
    return this.beneficiaryDetailsGroupForm.get('bankCode');
  }
  get Swiftcode() {
    return this.beneficiaryDetailsGroupForm.get('Swiftcode');
  }
  get firstName() {
    return this.beneficiaryDetailsGroupForm.get('firstName');
  }
  get lastName() {
    return this.beneficiaryDetailsGroupForm.get('lastName');
  }
  get Code() {
    return this.beneficiaryDetailsGroupForm.get('Code');
  }
  get nationality() {
    return this.beneficiaryDetailsGroupForm.get('nationality');
  }
  get placeofbirth() {
    return this.beneficiaryDetailsGroupForm.get('placeofbirth');
  }
  get dob() {
    return this.beneficiaryDetailsGroupForm.get('dob');
  }
  get country() {
    return this.beneficiaryDetailsGroupForm.get('country');
  }

  get routingnumber() {
    return this.beneficiaryDetailsGroupForm.get('routingnumber');
  }
  get ifsc() {
    return this.beneficiaryDetailsGroupForm.get('ifsc');
  }
  get iban() {
    return this.beneficiaryDetailsGroupForm.get('iban');
  }
  get branchCode() {
    return this.beneficiaryDetailsGroupForm.get('branchCode');
  }

  ngOnInit() {
    this.beneficiaryDetailsGroupForm = this.rootFormFroup.control.get(
      this.formGroupName
    ) as FormGroup;

    this.getcountryname();
    this.getAgentReceivingCountries();
    this.getBenificieryCurrencies();
    this.beneficiary = this.dataservice.transferdata;
    this.beneficiaryView = this.dataservice.beneficiaryViewData;
    this.isPersonal = this.dataservice.beneficiaryViewData.isCorporate;
    console.log('benelabel4', this.beneficiary.benelabel4);
    this.beneficiaryDetailsGroupForm.patchValue({
      firstName: this.beneficiaryView.beneficiaryFirstName,
      lastName: this.beneficiaryView.beneficiaryLastName,
      dob: this.beneficiaryView.dateOfBirth,
      Code: this.beneficiaryView.contactId,
      placeofbirth: this.beneficiaryView.beneficiaryPlaceOfBirth,
      nationality: this.beneficiaryView.nationalityDetailId,
      CompanyName: this.beneficiaryView.beneficiaryFirstName,
      MobileNumber: this.beneficiaryView.beneficiaryMobileNumber,
      code: this.beneficiaryView.mobileCountryCode,
      contactNumber: this.beneficiaryView.contactNumber,
      address: this.beneficiaryView.beneficiaryAddress,
      country: this.beneficiaryView.countryId,
      bankName: this.beneficiary.beneficiaryBankName,
      accountNumber: this.beneficiary.beneficiaryAccountNumber,
      bankBranch: this.beneficiary.beneficiaryBankBranch,
      Currency: this.beneficiary.bankCurrencyId,
      bankCode: this.beneficiary.beneficiaryBankCode,
      Swiftcode: this.beneficiary.beneficiarySwiftCode,
      routingnumber: this.beneficiary.beneficiaryRoutingNumber,
      ifsc: this.beneficiary.benelabel4,
      iban: this.beneficiary.benelabel5,
      branchCode: this.beneficiary.benelabel6,
    });
    console.log('benview', this.beneficiaryView);
    console.log('ben', this.beneficiary);
    if (this.dataservice.isBenEditable.isEditable == false) {
      this.CompanyName?.disable();
      this.contactNumber?.disable();
      this.MobileNumber?.disable();
      this.address?.disable();
      this.firstName?.disable();
      this.lastName?.disable();
      this.Code?.disable();

      this.dob?.disable();
      this.placeofbirth?.disable();
      this.nationality?.disable();
      this.country?.disable();
    }
    console.log(this.dataservice.isBankEditable);

    if (this.dataservice.isBankEditabled.isEditable == false) {
      this.bankName?.disable();
      this.accountNumber?.disable();
      this.bankBranch?.disable();
      this.Currency?.disable();
      this.bankCode?.disable();
      this.routingnumber?.disable();
      this.Swiftcode?.disable();
      this.ifsc?.disable();
      this.iban?.disable();
      this.branchCode?.disable();
    }
  }
  getCustomerVolumeReportSummary(receviedData: any) {
    console.log('receviedData', receviedData);

    const data = {
      id: receviedData.agentSenderDetailsid,
      sendingCurrencyCode: 'GBP',
    };
    this.transferService.getsummary(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.tableData = res['responseDto'];
        }
      },
    });
  }
  onSwitchChange(event: any) {
    console.log(event);

    this.mySwitchValue = event;
  }
  getBank(id: any) {
    this.getAgentReceivingCountries();
    this.showBankCode = id;
  }
  getAgentReceivingCountries() {
    const data: any = {};
    console.log('cou', this.dataservice.transferdata);
    data['clientcurrencyid'] = this.beneficiaryDetailsGroupForm.get('country')
      ?.value
      ? this.beneficiaryDetailsGroupForm.get('country')?.value
      : this.dataservice.transferdata.beneficiaryBankCountryId;
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
          this.isIfsc = this.receivingCountriesData.label4 ? true : false;
          this.isIban = this.receivingCountriesData.label5 ? true : false;
          this.isBranchCode = this.receivingCountriesData.label6 ? true : false;
        }
        console.log('curr', this.bankCodeInput);
        console.log('curr2', this.swiftCodeInput);
        console.log('curr3', this.routingNumber);
      });
  }

  getBenificieryCurrencies() {
    const data: any = {};

    data['refCode'] = 'MN'; //this.referenceCountryCode

    this.transferService
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
  updateUser() {
    if (this.dataservice.transferdata.isCorporate === true) {
      this.updatecorpoate();
    } else {
      this.updateBenificary();
    }
    this.updateBankDetails();
  }

  updatecorpoate() {
    const data = {
      agentBeneficiaryDetailsId:
        this.dataservice.transferdata.agentBeneficiaryDetailsId,
      beneficiaryFirstName:
        this.beneficiaryDetailsGroupForm.get('CompanyName')?.value,
      contactId: this.beneficiaryDetailsGroupForm.get('Code')?.value,
      contactNumber:
        this.beneficiaryDetailsGroupForm.get('contactNumber')?.value,
      mobileId: this.beneficiaryDetailsGroupForm.get('Code')?.value,
      mobileNumber: this.beneficiaryDetailsGroupForm.get('MobileNumber')?.value,
      address: this.beneficiaryDetailsGroupForm.get('address')?.value,
      clientCountryId: this.beneficiaryDetailsGroupForm.get('countryId')?.value,
      isCoporateBeneficiary: true,
      agentSenderDetailsDto: {
        agentSenderDetailsId:
          this.dataservice.transferdata.agentSenderDetailsId,
      },
      isActive: true,
    };
    this.transferService.updateBeneficiary(data).subscribe(
      (res: any) => {
        if (res['responseDto']) {
          this.createNotification(
            'success',
            'Success',
            'Beneficiary Details Updated successfully',
            '#ffffff',
            '#00A03E'
          );
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
  updateBenificary() {
    const data = {
      agentBeneficiaryDetailsId:
        this.dataservice.transferdata.agentBeneficiaryDetailsId,
      beneficiaryFirstName:
        this.beneficiaryDetailsGroupForm.get('firstName')?.value,
      beneficiaryLastName:
        this.beneficiaryDetailsGroupForm.get('lastName')?.value,

      contactId: this.beneficiaryDetailsGroupForm.get('Code')?.value,
      contactNumber:
        this.beneficiaryDetailsGroupForm.get('contactNumber')?.value,
      mobileId: this.beneficiaryDetailsGroupForm.get('Code')?.value,
      dateOfBirth: this.beneficiaryDetailsGroupForm.get('dob')?.value,
      nationalityDetailsId:
        this.beneficiaryDetailsGroupForm.get('nationality')?.value,
      // city: this.beneficiaryDetailsGroupForm.get('nationality')?.value,
      // placeOfBirth: this.beneficiaryDetailsGroupForm.get('nationality')?.value,
      mobileNumber: this.beneficiaryDetailsGroupForm.get('MobileNumber')?.value,
      address: this.beneficiaryDetailsGroupForm.get('address')?.value,
      clientCountryId: this.beneficiaryDetailsGroupForm.get('countryId')?.value,
      isCoporateBeneficiary: false,
      agentSenderDetailsDto: {
        agentSenderDetailsId:
          this.dataservice.transferdata.agentSenderDetailsId,
      },
      isActive: true,
    };
    this.transferService.updateBeneficiary(data).subscribe(
      (res: any) => {
        if (res['responseDto']) {
          this.createNotification(
            'success',
            'Success',
            'Updated successfully',
            '#ffffff',
            '#00A03E'
          );
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
  get accountNumber() {
    return this.beneficiaryDetailsGroupForm.get('accountNumber');
  }
  get bankBranch() {
    return this.beneficiaryDetailsGroupForm.get('bankBranch');
  }
  get bankName() {
    return this.beneficiaryDetailsGroupForm.get('bankName');
  }
  get Currency() {
    return this.beneficiaryDetailsGroupForm.get('Currency');
  }
  updateBankDetails() {
    const data: any = {};
    data['exposableId'] = 'JVb3mfaNS29';
    data['agentTransactionDetailId'] =
      this.dataservice.transferdata.agentTransactionDetailId;
    data['countryId'] = this.beneficiaryView.countryId;

    const formData: any = {
      beneficiaryDetailsId:
        this.dataservice.transferdata.agentBeneficiaryDetailsId,
      bankName: this.bankName?.value,
      branchName: this.bankBranch?.value,
      accountNumber: this.accountNumber?.value,
      clientCurrencyId: this.Currency?.value,
      swiftCode: this.Swiftcode?.value,
      routingNumber: this.routingnumber?.value,
      bankCode: this.bankCode?.value,
      label4: this.ifsc?.value,
      label5: this.iban?.value,
      label6: this.branchCode?.value,
    };
    this.transferService.updateBankAccountDetails(data, formData).subscribe(
      (res: any) => {
        if (res['responseDto']) {
          this.createNotification(
            'success',
            'Success',
            'Bank Details Updated successfully',
            '#ffffff',
            '#00A03E'
          );
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
          'Bank Details Update failed',
          '#ffffff',
          '#cc2d2d'
        );
      }
    );
  }

  getAllNationalityDetails() {
    this.transferService.getNationality().subscribe((res: any) => {
      if (res['responseDto']) {
        this.nationalityData = res['responseDto'];
      } else {
        this.nationalityData = [];
      }
    });
  }
  getcountryname() {
    const data: any = {};
    data['exposeId'] = 'JVb3mfaNS29';
    this.transferService.getcountryname(data).subscribe((res: any) => {
      this.countryData = res['responseDto'];
    });
  }
  getCountryCode() {
    const data: any = {};

    this.transferService
      .getCountryCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.countryCodeDetails = res['responseDto'];
            //this.getAllRecievingCurrency()
            // this.getRate()
          }
          //console.log('hiiii', this.sendingCurrencyCode)
        },
      });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
