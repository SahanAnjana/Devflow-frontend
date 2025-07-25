import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { CommonsService } from 'src/app/_services/commons.service';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { CommunicationService } from 'src/app/_services/communication.service';
import { MetaService } from 'src/app/_services/meta.service';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent {
  clientData: any;
  public signupForm!: FormGroup;
  countries: any[] = [];
  titles: any[] = [];
  countryCodes: any[] = [];
  nationalitiesList: any[] = [];
  todayDate = new Date();
  agents: any[] = [];
  agentExposableId: any;
  isAvailable: any;

  amlCountryId: any;
  expireDate!: string;

  // isImagesRequired = true;
  // isSecondaryImagesRequired = false;
  reference = null;
  agentBasicInfoDetailsId = '';
  journeyId = null;
  dualRegistrationData = null;
  journeyIdScan = null;
  isDateOfBirthValid!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private communicationService: CommunicationService,
    // private amlCustomerDataService: AmlCustomerDataService,
    // private userDataService: UserDataService,
    // private agentDataService: AgentDataService,
    private metaService: MetaService,
    private modalRef: NzModalRef,
    // private countryDataService: CountryDataService,
    public router: Router,
    // private nationalityDetailsService: NationalityDetailsService,
    // private dualRegistrationDataService: DualRegistrationDataService,
    private notificationService: NzNotificationService,
    private eventTriggerService: EventTriggerService,
    private commonsService: CommonsService,
    private agentCustomerService: AgentCustomerService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
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
    } = CustomValidators;
    this.signupForm = this.formBuilder.group({
      agentName: [null, Validators.required],
      title: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      contactNumber: [null, [customRequired('Contact Number'), maxLength(15)]],
      code: [null, Validators.required],
      userName: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(
            // tslint:disable-next-line:max-line-length
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            { has: true }
          ),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true,
          }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(
            /[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]/,
            { hasSpecialCharacters: true }
          ),
          Validators.minLength(8),
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true,
          }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(
            /[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]/,
            { hasSpecialCharacters: true }
          ),
          Validators.minLength(8),
        ]),
      ],
      address: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/[a-zA-Z ]/, { hasLetter: true }),
        ]),
      ],
      city: [null, Validators.required],
      stateProvince: [null, Validators.required],
      postCode: [null, Validators.required],
      country: [null, Validators.required],
      nationality: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      placeOfBirth: [null, Validators.required],
    });

    this.getAllAgentDetails();
    this.getAllNationalities();
    this.getAllContactTitles();
    this.getAllCountryCodes();
  }

  get agentName() {
    return this.signupForm.get('agentName');
  }
  get title() {
    return this.signupForm.get('title');
  }
  get code() {
    return this.signupForm.get('code');
  }
  get firstName() {
    return this.signupForm.get('firstName');
  }
  get lastName() {
    return this.signupForm.get('lastName');
  }
  get contactNumber() {
    return this.signupForm.get('contactNumber');
  }
  get userName() {
    return this.signupForm.get('userName');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get address() {
    return this.signupForm.get('address');
  }
  get city() {
    return this.signupForm.get('city');
  }
  get stateProvince() {
    return this.signupForm.get('stateProvince');
  }
  get postCode() {
    return this.signupForm.get('postCode');
  }
  get country() {
    return this.signupForm.get('country');
  }
  get nationality() {
    return this.signupForm.get('nationality');
  }
  get dateOfBirth() {
    return this.signupForm.get('dateOfBirth');
  }
  get placeOfBirth() {
    return this.signupForm.get('placeOfBirth');
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
          control.markAsDirty();
          control.updateValueAndValidity();
          const filedName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            filedName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        } else {
          if (field === 'userName') {
            this.isFieldValid(field);
          }
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  validateDob() {
    let currentDate = new Date();
    let selectionDate =
      Number(format(new Date(this.dateOfBirth?.value), 'yyyy')) * 365 +
      Number(format(new Date(this.dateOfBirth?.value), 'MM')) * 30 +
      Number(format(new Date(this.dateOfBirth?.value), 'dd'));
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

  getFieldName(option: any): any {
    switch (option) {
      case 'agentName': {
        return 'Agent Name';
      }
      case 'title': {
        return 'Contact Title';
      }
      case 'code': {
        return 'Code';
      }
      case 'firstName': {
        return 'First Name';
      }
      case 'lastName': {
        return 'Last Name';
      }
      case 'contactNumber': {
        return 'Contact Number';
      }
      case 'userName': {
        return 'Username / Email';
      }
      case 'password': {
        return 'Password';
      }
      case 'confirmPassword': {
        return 'Confirm Password';
      }
      case 'address': {
        return 'Address';
      }
      case 'city': {
        return 'City';
      }
      case 'stateProvince': {
        return 'State / Province';
      }
      case 'postCode': {
        return 'Post Code';
      }
      case 'country': {
        return 'Country';
      }
      case 'nationality': {
        return 'Nationality';
      }
      case 'dateOfBirth': {
        return 'Date of Birth';
      }
      case 'placeOfBirth': {
        return 'Place of Birth';
      }
    }
  }

  getAllAgentDetails() {
    this.communicationService.getAllAgent().subscribe((res: any) => {
      if (res['responseDto']) {
        this.agents = res['responseDto'];
      }
    });
  }
  getAllContactTitles() {
    this.metaService.getAllContactTitleNames().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.titles = res['responseDto'];
        }
      },
    });
  }
  getAllCountryCodes() {
    this.metaService.getAllcountryCode().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.countryCodes = res['responseDto'];
        }
      },
    });
  }
  // getSignupCountries(data: any) {
  //   this.agentCustomerSignupCountires
  //     .getAllCountries(data)
  //     .subscribe((res: any) => {
  //       this.countries = res['responseDto'];
  //     });
  // }
  changeAgent() {
    this.agentExposableId = this.agentName!.value.agentExposableId;
    this.getSignupCountries(this.agentName!.value.agentExposableId);

    this.signupForm.patchValue({
      country: null,
    });
  }

  checkPassword() {
    const password = this.password!.value;
    const confirmPassword = this.confirmPassword!.value;

    if (password !== confirmPassword) {
      this.notificationService.create(
        'error',
        'Password Incorrect',
        'Password and confirmation password do not match',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    }
  }

  createAccount() {
    if (!this.signupForm.valid) {
      this.validateAllFormFields(this.signupForm);
      return;
    } else if (this.password!.value !== this.confirmPassword!.value) {
      this.notificationService.create(
        'error',
        'Password Incorrect',
        'Password and confirmation password do not match',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else if ((this.isDateOfBirthValid = false)) {
      this.validateDob();
    } else {
      this.saveCustomerBasicDetails();
    }
  }

  isFieldValid(field: string) {
    let message: string;

    if (
      !this.signupForm!.get(field)!.valid &&
      this.signupForm!.get(field)!.touched
    ) {
      switch (field) {
        case 'email': {
          message = 'Email must be valid email';
          break;
        }
        case 'userName': {
          message = 'Username must be Valid email';
          break;
        }
        case 'password': {
          message =
            'Password must contain at least 8 characters with one Uppercase/ one simple case/ one number/ one special character';
          break;
        }
        case 'confirmPassword': {
          // tslint:disable-next-line:max-line-length
          message =
            'Confirm Password must contain at least 8 characters with one Uppercase/ one simple case/ one number/ one special character';
          break;
        }
        default: {
          message = 'Input error';
          break;
        }
      }
      this.notificationService.create('error', 'Input Error', message, {
        nzStyle: { background: '#cc2d2d', color: '#fff' },
      });
    }
  }

  dateFormatter(date: string) {
    return format(new Date(date), 'yyyy-MM-dd');
  }

  getAllNationalities() {
    this.metaService.getNationalities().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.nationalitiesList = res['responseDto'];
        }
      },
    });
  }

  checkUsernameAvailability() {
    const data: any = {};
    data['username'] = this.userName!.value;

    // this.userDataService.checkUserAvailability(data).subscribe((res:any) => {
    //   if (res['responseDto']) {
    //     this.isAvailable = res['responseDto'].isAvailable;
    //     if (res['responseDto'].isAvailable === false) {
    //       this.notificationService.create('error','Input Error', 'Sorry, Email address is already registered',{nzStyle:{background:'#cc2d2d'}});
    //     }
    //   }
    // });
  }

  disableFutureDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };

  isContainLetter() {
    if (this.signupForm.controls['address'].hasError('hasLetter')) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Address must contain at least 1 letter',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getSignupCountries(agentExposableId: any) {
    const data = agentExposableId;

    this.metaService.getCountries(data).subscribe((res: any) => {
      if (res['responseDto']) this.countries = res['responseDto'];
    });
  }

  closeModal() {
    this.modalRef.destroy();
  }

  saveCustomerBasicDetails() {
    let data;

    data = {
      title: this.title?.value,
      senderFirstName: this.firstName?.value,
      senderLastName: this.lastName?.value,
      countryCodesId: this.code?.value,
      mobileNumber: this.contactNumber?.value,
      username: this.userName?.value,
      password: this.password?.value,
      address: this.address?.value,
      // "agentPromoCode": "1234",//nullable,
      city: this.city?.value,
      stateOrProvince: this.stateProvince?.value,
      postCode: this.postCode?.value,
      nationalityDetailsId: this.nationality?.value,
      clientCode: 'MN', //nullable
      signUpCountryId: this.country?.value, // "agentCustomerSignupCountriesId":1,http://10.15.26.150:31561
      dateOfBirth: format(this.dateOfBirth?.value, 'yyyy-MM-dd'),
      placeOfBirth: this.placeOfBirth?.value,
      registeredFrom: 'CORE_PLATFORM', //ENUMS
      isAML: false, //default,
      referredAgentId: this.agentName?.value.agentDetailId,
      agentRefNumber: this.agentName?.value.agentExposableId,
    };

    this.agentCustomerService.signUpCustomer(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Customer Registerd Successfully',
            { nzStyle: { background: '#00A03E' } }
          );
          this.eventTriggerService.onReloadServiceData('signup');
          this.closeModal();
        } else {
          this.notificationService.create(
            'error',
            'Input Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
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
}
