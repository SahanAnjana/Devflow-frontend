import { Component, Input, Output, ViewChild } from '@angular/core';
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
import { BeneficiariesComponent } from '../beneficiaries.component';

@Component({
  selector: 'app-view-beneficiaries-basic-details',
  templateUrl: './view-beneficiaries-basic-details.component.html',
  styleUrls: ['./view-beneficiaries-basic-details.component.sass'],
})
export class ViewBeneficiariesBasicDetailsComponent {
  currentIndex = 0;
  nationalityDetailId: any;
  prev(): void {
    this.currentIndex = 0;
  }

  next() {
    this.currentIndex = this.currentIndex + 1;
  }

  @ViewChild(BeneficiariesComponent)
  BeneficiariesComponentinfo!: BeneficiariesComponent;

  @Input() incomingSelectedBeniId: any = {};
  @Input() incomingSelectedCountryiId: any = {};
  @Input() incomingIsCorporate: any;
  isCoporate: any;
  switchValue = false;
  codeDetails: any;
  nationalityData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  beneficiaryFirstName: any;
  beneficiaryLastName: any;
  contactNumber: any;
  beneficiaryAddress: any;
  dateOfBirth: any;
  isCorporate: any;
  countryCode: any;
  mobileCountryCode: any;
  countryId: any;
  currencyCodeDesc: any;
  beneficiaryMobileNumber: any;
  beneficiaryPlaceOfBirth: any;
  contactId: any;
  isEditable: any;
  exposableId: any;
  currentUser: any;
  agentSenderDetailsId: any;

  beneficiarybasicdetails!: FormGroup;

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private benificiaryService: BenificiaryService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder,
    public modalRef: NzModalRef
  ) {
    {
      this.currentUser = commonService.parseJwt(tokenService.getToken());
    }
  }
  ngOnInit() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;

    this.beneficiarybasicdetails = this.fb.group({
      companyName: [null, [customRequired('Company Name')]],
      corporateCoCode: [null, [customRequired('Contact Code')]],
      coporateCoNo: [
        null,
        Validators.compose([maxLength(15), customRequired('Contact number')]),
      ],
      corporateMoCode: [null, [customRequired('Mobile Code')]],
      corporateMoNo: [
        null,
        Validators.compose([maxLength(15), customRequired('Contact Number')]),
      ],
      coporateAddress: [null, [customRequired('Address')]],
      firstName: [null, [customRequired('First Name')]],
      lastName: [null, [customRequired('Last Name')]],
      PerosnalCoCode: [null, null],
      personalContactNumber: [null, Validators.compose([maxLength(15)])],
      personalMocode: [null, [customRequired('Mobile code')]],
      perosnalMoNo: [
        null,
        Validators.compose([maxLength(15), customRequired('Contact Number')]),
      ],
      perosnalAddress: [null, [customRequired('Address')]],
      dob: [null, [customRequired('Date Of Birth')]],
      pob: [null, [customRequired('Place Of Birth')]],
      nationality: [null, [customRequired('Nationality')]],
      coporateSwitch: [null, [customRequired('Coporate Switch')]],
    });

    // this.getExposableId();
    this.getCountryCodesDetails();
    this.getAllNationalityDetails();
    this.getBasicData();
    //this.getAgentSender()

    this.isCoporate = this.incomingIsCorporate;

    console.log('coporate status', this.incomingIsCorporate);
  }

  getExposableId(agentSenderUserName: any) {
    const data: any = {};
    //data['username'] = 'clspotonagent@gmail.com';
    data['username'] = agentSenderUserName;
    this.benificiaryService
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['agentExposableId'];
          // this.getAllSubAgentNames();
          // this.getRate();
          //this.getCountries();
          //this.getExisitingBenificiaryDetails();
          //this.addNewBank()
          this.getAgentSender();
          console.log('working in benificiery', this.exposableId);
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  getAgentSender() {
    const data: any = {};

    data['exposableId'] = this.exposableId;
    data['email'] = this.currentUser.sub;
    this.benificiaryService
      .getSenderDetails(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.agentSenderDetailsId =
            res['responseDto']['agentSenderDetailsId'];
          // this.getAllSubAgentNames();
          // this.getRate();
          //this.getCountries();
          //this.getExisitingBenificiaryDetails();
          //this.addNewBank()
          console.log('working', this.agentSenderDetailsId);
        },
        error: () => {
          console.log('not working', this.agentSenderDetailsId);
        },
      });
  }

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.beneficiarybasicdetails.controls).forEach((field: any) => {
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
      case 'companyName': {
        return 'Company Name';
      }
      case 'corporateCoCode': {
        return 'Contact Code';
      }
      case 'coporateCoNo': {
        return 'Contact Number';
      }
      case 'corporateMoCode': {
        return 'Mobile Code';
      }
      case 'corporateMoNo': {
        return 'Mobile Number';
      }
      case 'coporateAddress': {
        return 'Address';
      }
      case 'firstName': {
        return 'First Name';
      }
      case 'lastName': {
        return 'Last Name';
      }
      case 'PerosnalCoCode': {
        return 'Contact Code';
      }
      case 'personalContactNumber': {
        return 'Contact Number';
      }
      case 'personalMocode': {
        return 'Mobile Code';
      }
      case 'perosnalMoNo': {
        return 'Mobile Number';
      }
      case 'perosnalAddress': {
        return 'Address';
      }
      case 'dob': {
        return 'Date Of Birth';
      }
      case 'pob': {
        return 'Place Of Birth';
      }
      case 'nationality': {
        return 'Nationality';
      }
      case 'coporateSwitch': {
        return 'coporateSwitch';
      }
    }
  }

  update() {
    console.log(this.beneficiarybasicdetails);
  }

  updateCoporate() {
    if (this.isCoporate === false) {
      this.isCoporate = !this.isCoporate;
    } else {
      this.isCoporate = !this.isCoporate;
    }
  }

  get companyName() {
    return this.beneficiarybasicdetails.get('companyName');
  }
  get corporateCoCode() {
    return this.beneficiarybasicdetails.get('corporateCoCode');
  }
  get coporateCoNo() {
    return this.beneficiarybasicdetails.get('coporateCoNo');
  }
  get corporateMoCode() {
    return this.beneficiarybasicdetails.get('corporateMoCode');
  }
  get corporateMoNo() {
    return this.beneficiarybasicdetails.get('corporateMoNo');
  }
  get coporateAddress() {
    return this.beneficiarybasicdetails.get('coporateAddress');
  }
  get firstName() {
    return this.beneficiarybasicdetails.get('firstName');
  }
  get lastName() {
    return this.beneficiarybasicdetails.get('lastName');
  }
  get PerosnalCoCode() {
    return this.beneficiarybasicdetails.get('PerosnalCoCode');
  }
  get personalContactNumber() {
    return this.beneficiarybasicdetails.get('personalContactNumber');
  }

  get personalMocode() {
    return this.beneficiarybasicdetails.get('personalMocode');
  }

  get perosnalMoNo() {
    return this.beneficiarybasicdetails.get('perosnalMoNo');
  }

  get perosnalAddress() {
    return this.beneficiarybasicdetails.get('perosnalAddress');
  }

  get dob() {
    return this.beneficiarybasicdetails.get('dob');
  }

  get pob() {
    return this.beneficiarybasicdetails.get('pob');
  }

  get nationality() {
    return this.beneficiarybasicdetails.get('nationality');
  }

  get coporateSwitch() {
    return this.beneficiarybasicdetails.get('coporateSwitch');
  }

  getCountryCodesDetails() {
    this.benificiaryService.getCountryCode().subscribe((res: any) => {
      this.codeDetails = res['responseDto'];
    });
  }

  getAllNationalityDetails() {
    this.benificiaryService.getNationality().subscribe((res: any) => {
      if (res['responseDto']) {
        this.nationalityData = res['responseDto'];
      } else {
        this.nationalityData = [];
      }
    });
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
            this.beneficiaryFirstName =
              res['responseDto']['beneficiaryFirstName'];
            this.beneficiaryLastName =
              res['responseDto']['beneficiaryLastName'];
            this.contactNumber = res['responseDto']['contactNumber'];
            this.beneficiaryAddress = res['responseDto']['beneficiaryAddress'];
            this.dateOfBirth = res['responseDto']['dateOfBirth'];
            this.isCorporate = res['responseDto']['isCorporate'];
            this.countryCode = res['responseDto']['countryCode'];
            this.mobileCountryCode = res['responseDto']['mobileCountryCode'];
            this.countryId = res['responseDto']['countryId'];
            this.currencyCodeDesc = res['responseDto']['currencyCodeDesc'];
            this.beneficiaryMobileNumber =
              res['responseDto']['beneficiaryMobileNumber'];
            this.beneficiaryPlaceOfBirth =
              res['responseDto']['beneficiaryPlaceOfBirth'];
            this.contactId = res['responseDto']['contactId'];
            this.nationalityDetailId =
              res['responseDto']['nationalityDetailId'];

            this.getExposableId(res['responseDto']['agentSenderUserName']);

            this.beneficiarybasicdetails.patchValue({
              firstName: this.beneficiaryFirstName,
              lastName: this.beneficiaryLastName,
              PerosnalCoCode: this.countryCode,
              personalContactNumber: this.contactNumber,
              personalMocode: this.mobileCountryCode,
              perosnalMoNo: this.beneficiaryMobileNumber,
              perosnalAddress: this.beneficiaryAddress,
              dob: this.dateOfBirth,
              pob: this.beneficiaryPlaceOfBirth,
              nationality: this.nationalityDetailId,
              companyName: this.beneficiaryFirstName,
              corporateCoCode: this.countryCode,
              coporateCoNo: this.contactNumber,
              corporateMoCode: this.mobileCountryCode,
              corporateMoNo: this.beneficiaryMobileNumber,
              coporateAddress: this.beneficiaryAddress,
            });
            //this.dataService.beniCountryId=this.countryId
          }
          console.log('aiyo sami', this.countryId);
          this.dataService.beniCountryId = this.countryId;
        },
      });
    console.log('plz come coporateeee', this.incomingIsCorporate);
    this.checkBenisEditable();
  }

  updateBenificieryPersonal() {
    if (this.incomingIsCorporate === false) {
      this.beneficiarybasicdetails.get('companyName')?.setValidators(null);
      this.beneficiarybasicdetails.get('companyName')?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('corporateCoCode')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('corporateCoCode')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('coporateCoNo')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('coporateCoNo')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('corporateMoCode')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('corporateMoCode')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('corporateMoNo')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('corporateMoNo')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('coporateAddress')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('coporateAddress')
        ?.updateValueAndValidity();
      // }else{
      //   this.beneficiarybasicdetails.get('firstName')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('firstName')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('lastName')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('lastName')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('PerosnalCoCode')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('PerosnalCoCode')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('personalContactNumber')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('personalContactNumber')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('personalMocode')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('personalMocode')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('perosnalMoNo')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('perosnalMoNo')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('perosnalAddress')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('perosnalAddress')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('dob')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('dob')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('pob')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('pob')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('nationality')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('nationality')?.updateValueAndValidity()

      if (!this.beneficiarybasicdetails.valid) {
        this.validateAllFormFields(this.beneficiarybasicdetails);
        return;
      }
    }

    const data: any = {};

    const formData = {
      agentBeneficiaryDetailsId: this.incomingSelectedBeniId,
      beneficiaryFirstName: this.firstName?.value,
      beneficiaryLastName: this.lastName?.value,
      contactId: this.PerosnalCoCode?.value,
      contactNumber: this.personalContactNumber?.value,
      mobileId: this.personalMocode?.value,
      mobileNumber: this.perosnalMoNo?.value,
      address: this.perosnalAddress?.value,
      dateOfBirth: this.dob?.value,
      nationalityDetailsId: this.nationality?.value,
      placeOfBirth: this.pob?.value,
      clientCountryId: this.countryId,
      isCoporateBeneficiary: this.incomingIsCorporate ? true : false,
      agentSenderDetailsDto: {
        agentSenderDetailsId: this.agentSenderDetailsId,
      },
      isActive: true,
    };

    this.benificiaryService.updateBenificery(formData).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Personal Beneficiary Updated Successfully',
            { nzStyle: { background: '#00A03E', color: '#ffff' } }
          );
          this.close();
          // this.BeneficiariesComponentinfo.getAllBenificiaryData()
          //location.reload()
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];

          this.notificationService.create(
            'error',
            'Error',
            'Personal Beneficiary details are already updated',
            {
              nzStyle: { background: '#CC2D2D', color: '#fff' },
            }
          );
        } else {
          this.notificationService.create(
            'error',
            'Error',
            'Personal Beneficiary Updating Failed',
            { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
          );
        }
      },
    });
  }

  updateBenificierycorp() {
    if (this.incomingIsCorporate === true) {
      //   this.beneficiarybasicdetails.get('companyName')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('companyName')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('corporateCoCode')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('corporateCoCode')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('coporateCoNo')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('coporateCoNo')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('corporateMoCode')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('corporateMoCode')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('corporateMoNo')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('corporateMoNo')?.updateValueAndValidity()
      //   this.beneficiarybasicdetails.get('coporateAddress')?.setValidators(null)
      //   this.beneficiarybasicdetails.get('coporateAddress')?.updateValueAndValidity()
      // }else{
      this.beneficiarybasicdetails.get('firstName')?.setValidators(null);
      this.beneficiarybasicdetails.get('firstName')?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('lastName')?.setValidators(null);
      this.beneficiarybasicdetails.get('lastName')?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('PerosnalCoCode')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('PerosnalCoCode')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails
        .get('personalContactNumber')
        ?.setValidators(null);
      this.beneficiarybasicdetails
        .get('personalContactNumber')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('personalMocode')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('personalMocode')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('perosnalMoNo')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('perosnalMoNo')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('perosnalAddress')?.setValidators(null);
      this.beneficiarybasicdetails
        .get('perosnalAddress')
        ?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('dob')?.setValidators(null);
      this.beneficiarybasicdetails.get('dob')?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('pob')?.setValidators(null);
      this.beneficiarybasicdetails.get('pob')?.updateValueAndValidity();
      this.beneficiarybasicdetails.get('nationality')?.setValidators(null);
      this.beneficiarybasicdetails.get('nationality')?.updateValueAndValidity();

      if (!this.beneficiarybasicdetails.valid) {
        this.validateAllFormFields(this.beneficiarybasicdetails);
        return;
      }
    }

    const data: any = {};

    const formData = {
      agentBeneficiaryDetailsId: this.incomingSelectedBeniId,
      beneficiaryFirstName: this.companyName?.value,
      //beneficiaryLastName:this.lastName?.value,
      contactId: this.corporateCoCode?.value,
      contactNumber: this.coporateCoNo?.value,
      mobileId: this.corporateMoCode?.value,
      mobileNumber: this.corporateMoNo?.value,
      address: this.coporateAddress?.value,
      //dateOfBirth: this.dob?.value,
      //nationalityDetailsId: this.nationality?.value,
      //placeOfBirth:this.pob?.value,
      clientCountryId: this.countryId,
      isCoporateBeneficiary: this.incomingIsCorporate ? true : false,
      agentSenderDetailsDto: {
        agentSenderDetailsId: this.agentSenderDetailsId,
      },
      isActive: true,
    };

    this.benificiaryService.updateBenificery(formData).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Corporate Beneficiary Updated Successfully',
            { nzStyle: { background: '#00A03E', color: '#ffff' } }
          );
          this.close();
          // this.BeneficiariesComponentinfo.getAllBenificiaryData()
          //location.reload()
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];

          this.notificationService.create(
            'error',
            'Error',
            'Corporate Beneficiary details are already updated',
            {
              nzStyle: { background: '#CC2D2D', color: '#fff' },
            }
          );
        } else {
          this.notificationService.create(
            'error',
            'Error',
            'Corporate Beneficiary Updating Failed',
            { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
          );
        }
      },
    });
  }

  checkBenisEditable() {
    const data: any = {};
    data['agentbeneficiaryDetailsId'] = this.incomingSelectedBeniId;
    this.benificiaryService
      .checkIsBeneficiaryEditable(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.isEditable = res['responseDto'];
          if (res['responseDto'] === true) {
            this.beneficiarybasicdetails.get('companyName')?.disable();
            this.beneficiarybasicdetails.get('corporateCoCode')?.disable();
            this.beneficiarybasicdetails.get('coporateCoNo')?.disable();
            this.beneficiarybasicdetails.get('corporateMoCode')?.disable();
            this.beneficiarybasicdetails.get('corporateMoNo')?.disable();
            this.beneficiarybasicdetails.get('coporateAddress')?.disable();
            this.beneficiarybasicdetails.get('firstName')?.disable();
            this.beneficiarybasicdetails.get('lastName')?.disable();
            this.beneficiarybasicdetails.get('PerosnalCoCode')?.disable();
            this.beneficiarybasicdetails
              .get('personalContactNumber')
              ?.disable();
            this.beneficiarybasicdetails.get('perosnalMoNo')?.disable();
            this.beneficiarybasicdetails.get('personalMocode')?.disable();
            this.beneficiarybasicdetails.get('perosnalAddress')?.disable();
            this.beneficiarybasicdetails.get('dob')?.disable();
            this.beneficiarybasicdetails.get('pob')?.disable();
            this.beneficiarybasicdetails.get('nationality')?.disable();
          }
        }
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

  test() {
    if (this.incomingIsCorporate === false) {
      this.updateBenificieryPersonal();
    } else {
      this.updateBenificierycorp();
    }
  }
}
