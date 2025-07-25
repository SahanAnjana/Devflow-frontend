import { Component, EventEmitter, Output } from '@angular/core';
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
import { format, differenceInCalendarDays } from 'date-fns';
import { ms } from 'date-fns/locale';
import { CustomValidators } from 'src/app/_helpers/custom-validators';

@Component({
  selector: 'app-add-newbeneficiariespersonal',
  templateUrl: './add-newbeneficiariespersonal.component.html',
  styleUrls: ['./add-newbeneficiariespersonal.component.sass'],
})
export class AddNewbeneficiariespersonalComponent {
  @Output() Gonext: EventEmitter<any> = new EventEmitter<any>();

  currentIndex = 0;
  mySwitchValue = false;
  isDisabled = true;
  isNewBeneficiary = true;
  isNewBank = false;
  isHide = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  countryCodeDetails: any;
  nationalityData: any;
  agentdetailsId: any;
  todayDate: any = Date.now();

  prev(): void {
    this.currentIndex = 0;
  }

  next() {
    this.currentIndex = this.currentIndex + 1;
  }
  isCoporate = '';
  switchValue = false;
  addNewPersonal!: FormGroup;
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

    this.addNewPersonal = this.fb.group({
      pFirstName: [
        null,
        [
          Validators.compose([
            Validators.required,
            CustomValidators.characterLength('First Name', 25),
          ]),
        ],
      ],
      pLastName: [
        null,
        [
          Validators.compose([
            Validators.required,
            CustomValidators.characterLength('Last Name', 25),
          ]),
        ],
      ],
      pcocode: [null, null],
      pContactNumber: [null, Validators.compose([maxLength(15)])],
      companyname: [
        null,
        [
          Validators.compose([
            Validators.required,
            CustomValidators.characterLength('Company Name', 25),
          ]),
        ],
      ],
      cCoCode: [null, null],
      cContactNumber: [null, Validators.compose([maxLength(10), minLength(3)])],
      cmocode: [null, [customRequired('Mobile Code')]],
      cmoNumber: [
        null,
        Validators.compose([
          maxLength(10),
          minLength(3),
          customRequired('Contact Number'),
        ]),
      ],
      cAddress: [null, [customRequired('Address')]],
      pmoCode: [null, [customRequired('Mobile Code')]],
      pMobileNumber: [
        null,
        Validators.compose([
          maxLength(10),
          minLength(3),
          customRequired('Contact Number'),
        ]),
      ],
      pAddress: [null, [customRequired('Address')]],
      dob: [null, [customRequired('Date Of Birth')]],
      pob: [null, [customRequired('Place Of Birth')]],
      Nationality: [null, null],
    });

    this.getCountryCode();
    this.getAllNationalityDetails();
    this.patchedDatas();
  }

  get pFirstName() {
    return this.addNewPersonal.get('pFirstName');
  }
  get pLastName() {
    return this.addNewPersonal.get('pLastName');
  }
  get pcocode() {
    return this.addNewPersonal.get('pcocode');
  }
  get pContactNumber() {
    return this.addNewPersonal.get('pContactNumber');
  }
  get companyname() {
    return this.addNewPersonal.get('companyname');
  }
  get cCoCode() {
    return this.addNewPersonal.get('cCoCode');
  }
  get cContactNumber() {
    return this.addNewPersonal.get('cContactNumber');
  }
  get cmocode() {
    return this.addNewPersonal.get('cmocode');
  }
  get cmoNumber() {
    return this.addNewPersonal.get('cmoNumber');
  }
  get cAddress() {
    return this.addNewPersonal.get('cAddress');
  }
  get pmoCode() {
    return this.addNewPersonal.get('pmoCode');
  }
  get pMobileNumber() {
    return this.addNewPersonal.get('pMobileNumber');
  }
  get pAddress() {
    return this.addNewPersonal.get('pAddress');
  }
  get dob() {
    return this.addNewPersonal.get('dob');
  }
  get pob() {
    return this.addNewPersonal.get('pob');
  }
  get Nationality() {
    return this.addNewPersonal.get('Nationality');
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
    private eventTriggerService: EventtriggerService
  ) {}

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.addNewPersonal.controls).forEach((field: any) => {
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
            { nzStyle: { background: '#cc2d2d', color: '#ffffff' } }
          );
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'pFirstName': {
        return 'First Name';
      }
      case 'pLastName': {
        return 'Last Name';
      }
      case 'pcocode': {
        return 'Contact Code';
      }
      case 'pContactNumber': {
        return 'Contact Number';
      }
      case 'companyname': {
        return 'Company Name';
      }
      case 'cCoCode': {
        return 'Contact Code';
      }
      case 'cContactNumber': {
        return 'Contact Number';
      }
      case 'cmocode': {
        return 'Mobile Code';
      }
      case 'cmoNumber': {
        return 'Mobile Number';
      }
      case 'cAddress': {
        return 'Address';
      }
      case 'pmoCode': {
        return 'Mobile Code';
      }
      case 'pMobileNumber': {
        return 'Mobile Number';
      }
      case 'pAddress': {
        return 'Address';
      }
      case 'dob': {
        return 'Date Of Birth';
      }
      case 'pob': {
        return 'Place Of Birth';
      }
      case 'Nationality': {
        return 'Nationality';
      }
      // case 'coporateSwitch': {
      //   return 'coporateSwitch';
      // }
    }
  }

  letterOnly(event: any): boolean {
    const separator = /^[a-zA-Z\s]*$/;
    return separator.test(event.key);
  }

  onSwitchChange() {
    if (this.mySwitchValue === false) {
      this.mySwitchValue = true;
      console.log('weda krnwa', this.mySwitchValue);
    } else {
      this.mySwitchValue = false;
      console.log('weda krnwa', this.mySwitchValue);
    }
    this.dataService.switchvalue = this.mySwitchValue;
    console.log('iscorporate', this.dataService.switchvalue);
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getCountryCode() {
    const data: any = {};

    this.benificiaryService
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

  getAllNationalityDetails() {
    this.benificiaryService.getNationality().subscribe((res: any) => {
      if (res['responseDto']) {
        this.nationalityData = res['responseDto'];
      } else {
        this.nationalityData = [];
      }
    });
  }

  addPersonalBenificiery() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;

    this.addNewPersonal.get('companyname')?.setValidators(null);
    this.addNewPersonal.get('companyname')?.updateValueAndValidity();

    this.addNewPersonal.get('cCoCode')?.setValidators(null);
    this.addNewPersonal.get('cCoCode')?.updateValueAndValidity();

    this.addNewPersonal.get('cContactNumber')?.setValidators(null);
    this.addNewPersonal.get('cContactNumber')?.updateValueAndValidity();

    this.addNewPersonal.get('cmocode')?.setValidators(null);
    this.addNewPersonal.get('cmocode')?.updateValueAndValidity();

    this.addNewPersonal.get('cmoNumber')?.setValidators(null);
    this.addNewPersonal.get('cmoNumber')?.updateValueAndValidity();

    this.addNewPersonal.get('cAddress')?.setValidators(null);
    this.addNewPersonal.get('cAddress')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pFirstName')
      ?.setValidators([customRequired('First Name')]);
    this.addNewPersonal.get('pFirstName')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pLastName')
      ?.setValidators([customRequired('Last Name')]);
    this.addNewPersonal.get('pLastName')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pLastName')
      ?.setValidators([customRequired('Last Name')]);
    this.addNewPersonal.get('pLastName')?.updateValueAndValidity();

    this.addNewPersonal.get('pcocode')?.setValidators(null);
    this.addNewPersonal.get('pcocode')?.updateValueAndValidity();

    this.addNewPersonal.get('pContactNumber')?.setValidators(null);
    this.addNewPersonal.get('pContactNumber')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pmoCode')
      ?.setValidators([customRequired('Mobile Code')]);
    this.addNewPersonal.get('pmoCode')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pMobileNumber')
      ?.setValidators([customRequired('Mobile Number')]);
    this.addNewPersonal.get('pMobileNumber')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pAddress')
      ?.setValidators([customRequired('Address')]);
    this.addNewPersonal.get('pAddress')?.updateValueAndValidity();

    this.addNewPersonal
      .get('dob')
      ?.setValidators([customRequired('Date of Birth')]);
    this.addNewPersonal.get('dob')?.updateValueAndValidity();

    this.addNewPersonal
      .get('pob')
      ?.setValidators([customRequired('Place of Birth')]);
    this.addNewPersonal.get('pob')?.updateValueAndValidity();

    this.addNewPersonal.get('Nationality')?.setValidators(null);
    this.addNewPersonal.get('Nationality')?.updateValueAndValidity();

    //this.addNewPersonal.get('cCoCode')?.setValidators(null)

    if (!this.addNewPersonal.valid) {
      this.validateAllFormFields(this.addNewPersonal);
      return;
    } else {
      const data: any = {};

      const formData = {
        beneficiaryFirstName: this.pFirstName?.value,
        beneficiaryLastName: this.pLastName?.value,
        dateOfBirth: this.dob?.value
          ? format(this.dob?.value, 'yyyy-MM-dd')
          : '', //this.dob?.value,
        clientCountryId: this.dataService.countryId,
        contactId: this.pcocode?.value,
        contactNumber: this.pContactNumber?.value,
        mobileId: this.pmoCode?.value,
        mobileNumber: this.pMobileNumber?.value,
        address: this.pAddress?.value,
        placeOfBirth: this.pob?.value,
        nationalityDetailsId: this.Nationality?.value,
        agentSenderDetailsDto: {
          agentSenderDetailsId: this.dataService.agentSenderId,
        },
        isActive: false,
        isCoporateBeneficiary: this.mySwitchValue,
        isMobile: true,
      };

      this.benificiaryService.addPersonalBenificiery(formData).subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'New Personal Beneficiary Added Successfully',
              { nzStyle: { background: '#00A03E', color: '#ffff' } }
            );

            this.agentdetailsId = res['responseDto']['id'];
            this.Gonext.emit();
            this.dataService.isSuccess = true;
            this.dataService.personalbenId = this.agentdetailsId;
            this.dataService.saveAddBenifisaryData = formData;
          } else if (res['errorDescription']) {
            const msg = res['errorDescription'];

            this.notificationService.create('error', 'Error', msg, {
              nzStyle: { background: '#CC2D2D', color: '#fff' },
            });
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'New Personal Beneficiary Adding Failed',
              { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
            );
          }
        },
      });
    }
  }

  addCorporateBenificiery() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;

    this.addNewPersonal.get('pFirstName')?.setValidators(null);
    this.addNewPersonal.get('pFirstName')?.updateValueAndValidity();
    this.addNewPersonal.get('pLastName')?.setValidators(null);
    this.addNewPersonal.get('pLastName')?.updateValueAndValidity();
    this.addNewPersonal.get('dob')?.setValidators(null);
    this.addNewPersonal.get('dob')?.updateValueAndValidity();
    this.addNewPersonal.get('pcocode')?.setValidators(null);
    this.addNewPersonal.get('pcocode')?.updateValueAndValidity();
    this.addNewPersonal.get('pContactNumber')?.setValidators(null);
    this.addNewPersonal.get('pContactNumber')?.updateValueAndValidity();
    this.addNewPersonal.get('pmoCode')?.setValidators(null);
    this.addNewPersonal.get('pmoCode')?.updateValueAndValidity();
    this.addNewPersonal.get('pMobileNumber')?.setValidators(null);
    this.addNewPersonal.get('pMobileNumber')?.updateValueAndValidity();
    this.addNewPersonal.get('pAddress')?.setValidators(null);
    this.addNewPersonal.get('pAddress')?.updateValueAndValidity();
    this.addNewPersonal.get('pob')?.setValidators(null);
    this.addNewPersonal.get('pob')?.updateValueAndValidity();
    this.addNewPersonal.get('Nationality')?.setValidators(null);
    this.addNewPersonal.get('Nationality')?.updateValueAndValidity();
    this.addNewPersonal
      .get('companyname')
      ?.setValidators([customRequired('Company Name')]);
    this.addNewPersonal.get('companyname')?.updateValueAndValidity();
    this.addNewPersonal.get('cCoCode')?.setValidators(null);
    this.addNewPersonal.get('cCoCode')?.updateValueAndValidity();
    this.addNewPersonal.get('cContactNumber')?.setValidators(null);
    this.addNewPersonal.get('cContactNumber')?.updateValueAndValidity();
    this.addNewPersonal
      .get('cmocode')
      ?.setValidators([customRequired('Mobile Code')]);
    this.addNewPersonal.get('cmocode')?.updateValueAndValidity();
    this.addNewPersonal
      .get('cmoNumber')
      ?.setValidators([customRequired('Mobile Number')]);
    this.addNewPersonal.get('cmoNumber')?.updateValueAndValidity();
    this.addNewPersonal
      .get('cAddress')
      ?.setValidators([customRequired('Address')]);
    this.addNewPersonal.get('cAddress')?.updateValueAndValidity();

    //this.addNewPersonal.get('cCoCode')?.setValidators(null)

    if (!this.addNewPersonal.valid) {
      this.validateAllFormFields(this.addNewPersonal);
      return;
    }

    const data: any = {};

    const formData = {
      beneficiaryFirstName: this.companyname?.value,
      contactId: this.cCoCode?.value,
      contactNumber: this.cContactNumber?.value,
      mobileId: this.cmocode?.value,
      mobileNumber: this.cmoNumber?.value,
      address: this.cAddress?.value,
      clientCountryId: this.dataService.countryId,
      isCoporateBeneficiary: this.mySwitchValue,
      agentSenderDetailsDto: {
        agentSenderDetailsId: this.dataService.agentSenderId,
      },
      isActive: false,
    };

    this.benificiaryService.addPersonalBenificiery(formData).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'New Corporate Beneficiary Added Successfully',
            { nzStyle: { background: '#00A03E', color: '#ffff' } }
          );

          this.agentdetailsId = res['responseDto']['id'];
          this.Gonext.emit();
          this.dataService.isSuccess = true;
          this.dataService.personalbenId = this.agentdetailsId;
          this.dataService.saveAddBenifisaryData = formData;
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];

          this.createNotification('error', msg, '#cc2d2d', 'Error');
        } else {
          this.notificationService.create(
            'error',
            'Error',
            'New Corporate Beneficiary Adding Failed',
            { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
          );
        }
      },
    });
  }

  patchedDatas() {
    console.log('patched values', this.dataService.saveAddBenifisaryData);
    this.addNewPersonal.patchValue({
      pFirstName: this.dataService.saveAddBenifisaryData.beneficiaryFirstName,
      pLastName: this.dataService.saveAddBenifisaryData.beneficiaryLastName,
      pcocode: this.dataService.saveAddBenifisaryData.contactId,
      pContactNumber: this.dataService.saveAddBenifisaryData.contactNumber,
      companyname: this.dataService.saveAddBenifisaryData.beneficiaryFirstName,
      cCoCode: this.dataService.saveAddBenifisaryData.contactId,
      cContactNumber: this.dataService.saveAddBenifisaryData.contactNumber,
      cmocode: this.dataService.saveAddBenifisaryData.mobileId,
      cmoNumber: this.dataService.saveAddBenifisaryData.mobileNumber,
      cAddress: this.dataService.saveAddBenifisaryData.address,
      pmoCode: this.dataService.saveAddBenifisaryData.mobileId,
      pMobileNumber: this.dataService.saveAddBenifisaryData.mobileNumber,
      pAddress: this.dataService.saveAddBenifisaryData.address,
      dob: this.dataService.saveAddBenifisaryData.dateOfBirth,
      pob: this.dataService.saveAddBenifisaryData.placeOfBirth,
      Nationality: this.dataService.saveAddBenifisaryData.nationalityDetailsId,
    });
  }

  test() {
    if (this.mySwitchValue === false) {
      this.addPersonalBenificiery();
    } else if (this.mySwitchValue === true) {
      this.addCorporateBenificiery();
    }
  }

  //  createNotifications(
  //   type: string,
  //   content: string,
  //   color: string,
  //   title: string
  // ): void {
  //   // console.log('createNotification');
  //   // title: string, message: string
  //   this.notificationService.create(type, title, content, {
  //     nzStyle: {
  //       background: color,
  //       color: '#fff',
  //       // width: '600px',
  //       // marginLeft: '-265px'
  //     },
  //   });
  // }

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

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.todayDate) > 0;

  //hiiiii
}
