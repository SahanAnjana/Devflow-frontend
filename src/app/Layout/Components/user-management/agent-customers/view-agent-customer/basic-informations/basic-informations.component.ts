import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { MetaService } from 'src/app/_services/meta.service';
import { DownloadCustomerIdentityImagesService } from 'src/app/_services/download-customer-identity-images.service';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { format } from 'date-fns';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-basic-informations',
  templateUrl: './basic-informations.component.html',
  styleUrls: ['./basic-informations.component.sass'],
})
export class BasicInformationsComponent {
  privileges: any = {
    CORE_SHOW_NEW_CUSTOMERS_DOWNLOAD_BUTTON: false,
  };

  receivedCustomerData: any;
  customerReference: any;

  viewNewAgentCustomer = false;
  viewDeclineButton = true;
  registeredFromData: any;

  journeyId = null;
  public basicInformation!: FormGroup;
  countries: any;
  agentExposableId: any;
  clientData: any;
  txtReadOnly = true;
  isAvailable = true;
  nationality: any;
  amlCheckDateAndUpdated = false;
  todayDate = new Date();

  agentCustomerSignupCountires: any;
  userDataService: any;
  nationalityDetailsService: any;
  creditSafeAmlDataService: any;
  signUpCountryList: any[] = [];
  nationalitiesList: any[] = [];
  allPrivilages: any;

  constructor(
    private dataService: DataService,
    private modalRef: NzModalRef,
    private metaService: MetaService,
    private downloadCustomerIdentityImagesService: DownloadCustomerIdentityImagesService,
    // private agentCustomerDataService: AgentCustomerDataService,
    private eventTriggerService: EventtriggerService,
    // private downloadCustomerIdentityImagesService: DownloadCustomerIdentityImagesService,
    private notificationService: NzNotificationService,
    // private customerIdentityImageDataService: CustomerIdentityImageDataService,
    private formBuilder: FormBuilder,
    private agentCustomerService: AgentCustomerService,
    // private agentDataService: AgentDataService,
    private commonsService: CommonsService, // private agentCustomerSignupCountires: AgentCustomerSignupCountriesService, // private userDataService: UserDataService, // private nationalityDetailsService: NationalityDetailsService, // private creditSafeAmlDataService: CreditSafeAmlDataService
    private tokenService: TokenserviceService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.basicInformation = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      placeOfBirth: [null, Validators.required],
      telephoneNumber: [null, Validators.required],
      mobileNumber: [null, Validators.required],
      email: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      postCode: [null, Validators.required],
      amlCheckDate: [null, Validators.required],
      registeredDate: [null, Validators.required],
      registeredFrom: [null, Validators.required],
      nationality: [null, Validators.required],
      stateOrProvince: [null, Validators.required],
    });

    if (this.dataService.clickEventStatus === 'newAgentCustomers') {
      this.viewNewAgentCustomer = true;
      this.viewDeclineButton = true;
    } else if (this.dataService.clickEventStatus === 'declinedAgentCustomers') {
      this.viewNewAgentCustomer = true;
      this.viewDeclineButton = false;
    } else {
      this.viewNewAgentCustomer = false;
    }

    this.getSelectedCustomerData();
    this.getExposableId();
    this.getAllNationalities();
    console.log(this.receivedCustomerData);
    this.eventTriggerService.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_NEW_CUSTOMERS_DOWNLOAD_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_NEW_CUSTOMERS_DOWNLOAD_BUTTON = true)
          : false;
      }
    });
  }
  get firstName() {
    return this.basicInformation.get('firstName');
  }
  get lastName() {
    return this.basicInformation.get('lastName');
  }
  get dateOfBirth() {
    return this.basicInformation.get('dateOfBirth');
  }
  get placeOfBirth() {
    return this.basicInformation.get('placeOfBirth');
  }
  get telephoneNumber() {
    return this.basicInformation.get('telephoneNumber');
  }
  get mobileNumber() {
    return this.basicInformation.get('mobileNumber');
  }
  get email() {
    return this.basicInformation.get('email');
  }
  get address() {
    return this.basicInformation.get('address');
  }
  get city() {
    return this.basicInformation.get('city');
  }
  get country() {
    return this.basicInformation.get('country');
  }
  get postCode() {
    return this.basicInformation.get('postCode');
  }
  get amlCheckDate() {
    return this.basicInformation.get('amlCheckDate');
  }
  get registeredDate() {
    return this.basicInformation.get('registeredDate');
  }
  get registeredFrom() {
    return this.basicInformation.get('registeredFrom');
  }
  get nationalities() {
    return this.basicInformation.get('nationality');
  }
  get stateOrProvince() {
    return this.basicInformation.get('stateOrProvince');
  }
  validateAllFormFields(formGroup: FormGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach((field) => {
      // {2}
      // console.log('current ---> ', field);
      const control = formGroup.get(field); // {3}
      if (control instanceof FormControl) {
        // {4}
        // console.log(control, ' is instanceof FormControl >>>>  ');
        if (!control.value && control.errors) {
          // console.log(' !control.value >>>>  ', !control.value);
          control.markAsDirty();
          control.updateValueAndValidity();
          // console.log(field);
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            {
              nzStyle: {
                background: '#cc2d2d',
              },
              nzDuration: 4500,
            }
          );
        } else {
        }
      } else if (control instanceof FormGroup) {
        // {5}
        this.validateAllFormFields(control); // {6}
      }
    });
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'firstName': {
        return 'First Name';
        break;
      }
      case 'lastName': {
        return 'Last Name';
        break;
      }
      case 'dateOfBirth': {
        return 'Date Of Birth';
        break;
      }
      case 'placeOfBirth': {
        return 'Place Of Birth';
        break;
      }
      case 'telephoneNumber': {
        return 'Telephone Number';
        break;
      }
      case 'mobileNumber': {
        return 'Mobile Number';
        break;
      }
      case 'email': {
        return 'Email';
        break;
      }
      case 'address': {
        return 'Address';
        break;
      }
      case 'city': {
        return 'City';
        break;
      }
      case 'country': {
        return 'Country';
        break;
      }
      case 'postCode': {
        return 'Post Code';
        break;
      }
      case 'amlCheckDate': {
        return 'Aml Check Date';
        break;
      }
      case 'registeredDate': {
        return 'Registered Date';
        break;
      }
      case 'registeredFrom': {
        return 'Registered From';
        break;
      }
      case 'nationality': {
        return 'Nationality';
        break;
      }
      case 'stateOrProvince': {
        return 'State Or Province';
        break;
      }
    }
  }

  getSignUpCountryDetails(data: any) {
    this.metaService.getCountries(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.signUpCountryList = res['responseDto'];
        }
      },
    });
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

  accept() {
    const data: any = {};
    data['requestType'] = 1;
    data['email'] = this.dataService.selectedData.email;
    data['isApprove'] = true;
    data['isActive'] = true;

    this.agentCustomerService.updateStatus(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.notificationService.create(
          'success',
          'Success',
          'Request approved successfully',
          { nzStyle: { background: '#00A03E' } }
        );
        this.closeModal();
      } else {
        this.notificationService.create(
          'error',
          'Failed',
          res['errorDescription'],
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      }
    });
  }

  decline() {
    const data: any = {};
    data['requestType'] = 1;
    data['email'] = this.dataService.selectedData.email;
    data['isApprove'] = false;
    data['isActive'] = false;

    this.agentCustomerService.updateStatus(data).subscribe(
      (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Request declined successfully',
            { nzStyle: { background: '#00A03E' } }
          );
          this.closeModal();
        } else {
          this.notificationService.create(
            'error',
            'Failed',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      },
      () => {
        this.notificationService.create(
          'error',
          'Error',
          'Request decline failed',
          { nzStyle: { background: '#cc2d2d' } }
        );
      }
    );
  }

  getSelectedCustomerData() {
    this.receivedCustomerData = this.dataService.selectedData;
    this.journeyId = this.receivedCustomerData.journeyId;
    this.registeredFromData = this.receivedCustomerData.registeredFrom;

    if (this.receivedCustomerData.userAgentSenderDetailsDtos) {
      this.customerReference =
        this.receivedCustomerData.userAgentSenderDetailsDtos[0].userDto.referenceNo;
    }

    this.basicInformation.patchValue({
      firstName: this.receivedCustomerData.customerFirstName,
      lastName: this.receivedCustomerData.customerLastName,
      dateOfBirth: this.receivedCustomerData.dateOfBirth,
      placeOfBirth: this.receivedCustomerData.placeOfBirth,
      telephoneNumber: this.receivedCustomerData.telephoneNo,
      mobileNumber: this.receivedCustomerData.handphoneNo,
      email: this.receivedCustomerData.email,
      address: this.receivedCustomerData.residentialAddress,
      city: this.receivedCustomerData.city,
      country: this.receivedCustomerData.signUpCountryId,
      postCode: this.receivedCustomerData.postCode,
      amlCheckDate: this.receivedCustomerData.amlCheckDate,
      registeredDate: this.receivedCustomerData.registeredDate,
      registeredFrom: this.receivedCustomerData.registeredFrom,
      nationality: this.receivedCustomerData.nationalityDetailsId,
      stateOrProvince: this.receivedCustomerData.stateOrProvince,
    });

    this.dateOfBirth?.disable();
    this.placeOfBirth?.disable();
    this.email?.disable();
    this.registeredDate?.disable();
    this.registeredFrom?.disable();
  }

  download() {
    const data: any = {};
    data['email'] = this.email!.value;
    data['dateOfBirth'] = this.dateOfBirth!.value;
    data['birthPlace'] = this.placeOfBirth!.value;
    this.email!.value
      ? this.downloadCustomerIdentityImagesService
          .downloadCustomerIdentityImages(data)
          .subscribe((res: any) => {
            this.createNotification(
              'success',
              'Success',
              'File Downoaded successfully',
              '#ffffff',
              '#00A03E'
            );
          })
      : this.notificationService.create(
          'error',
          'Download Failed',
          'Report Download Failed'
        );
  }

  closeModal() {
    this.modalRef.destroy();
    this.eventTriggerService.onReloadServiceData('agentCustUpdate');
  }

  downloadAMLReport() {
    this.dataService.selectedData.journeyId
      ? this.downloadCustomerIdentityImagesService
          .downloadAMLReport(this.dataService.selectedData.journeyId)
          .subscribe((res: any) => {
            this.createNotification(
              'success',
              'Success',
              'File Downoaded successfully',
              '#ffffff',
              '#00A03E'
            );
          })
      : this.notificationService.create(
          'error',
          'Download Failed',
          'Report Download Failed'
        );
  }
  update() {
    if (this.basicInformation.invalid) {
      this.validateAllFormFields(this.basicInformation);
      return;
    }

    const data = {
      agentSenderDetailsId: this.receivedCustomerData.agentSenderDetailsId,
      customerFirstName: this.firstName!.value,
      customerLastName: this.lastName!.value,
      telephoneNo: this.telephoneNumber!.value,
      handphoneNo: this.mobileNumber!.value,
      email: this.email!.value,
      residentialAddress: this.address!.value,
      dateOfBirth: this.dateOfBirth!.value,
      placeOfBirth: this.placeOfBirth!.value,
      postCode: this.postCode!.value,
      amlCheckDate: this.amlCheckDate!.value,
      city: this.city!.value,
      countryId: this.country!.value,
      nationalityDetailsId: this.nationalities!.value,
      stateOrProvince: this.stateOrProvince!.value,
      registeredFrom: this.registeredFrom?.value,
      registeredDate: this.receivedCustomerData.registeredDate,
      signUpCountryId: this.dataService.selectedData.signUpCountryId,
    };
    this.agentCustomerService
      .updateAgentCustomer(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.eventTriggerService.onReloadServiceData('agentCustUpdate');
          if (res['responseDto'].userAlreadyExist) {
            this.notificationService.create(
              'error',
              'Input Error',
              'Sorry, Email address is already registered',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          } else {
            this.notificationService.create(
              'success',
              'Success',
              'Agent Sender Details updated successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.eventTriggerService.onReloadServiceData('agentCustUpdate');
          }
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res.errorDescription,
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      });
    // } else {
    //   this.notificationService.createNotification('error', 'Sorry, Email address is already registered', '#cc2d2d', 'Input Error');
    // }
  }
  getExposableId() {
    this.metaService
      .getAgentDetailsGetExposableId(this.dataService.selectedData.email)
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            let agentExposableId = res['responseDto'].agentExposableId;
            this.getSignUpCountryDetails(agentExposableId);
          }
        },
      });
  }
  getSignupCountries(data: any) {
    this.agentCustomerSignupCountires
      .getAllCountries(data)
      .subscribe((res: any) => {
        this.countries = res['responseDto'];
      });
  }
  checkUsernameAvailability() {
    if (this.receivedCustomerData.email !== this.email!.value) {
      const data: any = {};
      data['username'] = this.email!.value;

      this.userDataService.checkUserAvailability(data).subscribe((res: any) => {
        if (res['responseDto']) {
          this.isAvailable = res['responseDto'].isAvailable;
          if (res['responseDto'].isAvailable === false) {
            this.notificationService.create(
              'error',
              'Input Error',
              'Sorry, Email address is already registered',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        }
      });
    } else {
      this.isAvailable = true;
    }
  }

  getAllActiveNationalityDetails() {
    this.nationalityDetailsService
      .getAllNationalityDetails()
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.nationality = res['responseDto'];
        } else {
          this.nationality = [];
        }
      });
  }

  downloadAMLCreditSafeReport() {
    this.email!.value
      ? this.downloadCustomerIdentityImagesService
          .downloadAMLCreditSafeReport(this.email!.value)
          .subscribe((res: any) => {
            this.createNotification(
              'success',
              'Success',
              'File Downoaded successfully',
              '#ffffff',
              '#00A03E'
            );
          })
      : this.notificationService.create(
          'error',
          'Download Failed',
          'Report Download Failed'
        );
  }

  disabledPastDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) < 0;
  };

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
