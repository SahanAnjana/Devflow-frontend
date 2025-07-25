import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.sass'],
})
export class EditUserComponent {
  @Input() mode: any = {};
  @Input() type: any;
  currentIndex = 0;

  edituserform!: FormGroup;

  isCoporate = '';
  switchValue = false;
  viewAllData: any;
  AllCountry: any;
  allPlatFormusers: any;
  public distroy$ = new Subject<void>();

  CountryType: any;
  pageNumber = 1;
  pageSize = 10;
  totalRecords: any;
  Active: any;

  public unsubscribe$ = new Subject<void>();
  constructor(
    private modalref: NzModalRef,
    private platformUserService: UserManagementPlatformUserService,
    private notificationService: NzNotificationService,
    private fb: FormBuilder,
    private dataServise: DataService
  ) {}

  ngOnInit() {
    const { customRequired, customEmail, pattern, minLength, maxLength } =
      MyValidators;
    this.edituserform = this.fb.group({
      CompanyName: [
        null,
        Validators.compose([
          Validators.required,
          customRequired('Company Name'),
          CustomValidators.maxLength(30),
        ]),
      ],
      CompanyRegistrationNumber: [
        null,
        Validators.compose([
          customRequired('Company Registration Number'),
          CustomValidators.maxLength(30),
        ]),
      ],
      OwnerName: [
        null,
        Validators.compose([
          customRequired('Owner Name'),
          CustomValidators.maxLength(20),
        ]),
      ],
      ContactNumber: [
        null,
        Validators.compose([
          customRequired('Contact Number'),
          CustomValidators.maxLength(12),
          CustomValidators.minLength(10),
        ]),
      ],
      EmailAddress: [
        null,
        Validators.compose([
          customRequired('Email Address'),
          CustomValidators.patternValidator(
            // tslint:disable-next-line:max-line-length
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            { has: true }
          ),
        ]),
      ],
      Address: [
        null,
        Validators.compose([
          customRequired('Address'),
          CustomValidators.maxLength(30),
        ]),
      ],
      Country: [null, customRequired('Country')],
      status: [null, customRequired('Status')],
      Reference: [
        null,
        Validators.compose([
          Validators.compose([
            customRequired('Reference'),
            CustomValidators.maxLength(15),
          ]),
        ]),
      ],
    });
    this.getAllCountrys();
    this.getAllViewdata();

    this.edituserform.patchValue({
      status: this.dataServise.newIsActive,
    });
  }

  get CompanyName() {
    return this.edituserform.get('CompanyName');
  }

  get CompanyRegistrationNumber() {
    return this.edituserform.get('CompanyRegistrationNumber');
  }

  get OwnerName() {
    return this.edituserform.get('OwnerName');
  }
  get ContactNumber() {
    return this.edituserform.get('ContactNumber');
  }
  get EmailAddress() {
    return this.edituserform.get('EmailAddress');
  }
  get Address() {
    return this.edituserform.get('Address');
  }
  get Country() {
    return this.edituserform.get('Country');
  }
  get Reference() {
    return this.edituserform.get('Reference');
  }
  get status() {
    return this.edituserform.get('status');
  }

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.edituserform.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
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

  numberOnly(event: any) {
    return (
      event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)
    );
  }

  numberAndLetter_AB(event: any) {
    const seperator = '^[a-zA-Z]*$';
    const maskSeperator = new RegExp(seperator, 'g');
    let result = maskSeperator.test(event.key);
    return result;
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'CompanyName': {
        return 'Company Name';
      }
      case 'CompanyRegistrationNumber': {
        return 'Company Registration Number';
      }
      case 'OwnerName': {
        return 'Owner Name';
      }
      case 'ContactNumber': {
        return 'Contact Number';
      }
      case 'EmailAddress': {
        return 'Email Address';
      }
      case 'Address': {
        return 'Address';
      }
      case 'Country': {
        return 'Country';
      }
      // case 'Reference': {
      //   return 'Reference';
      // }
    }
  }

  patchpalues() {
    this.edituserform.patchValue({
      CompanyName: this.viewAllData.companyname,
      CompanyRegistrationNumber: this.viewAllData.compayRegNumber,
      OwnerName: this.viewAllData.ownerName,
      ContactNumber: this.viewAllData.contactnumber,
      EmailAddress: this.viewAllData.email,
      Address: this.viewAllData.address,
      Country: this.viewAllData.countryName,
      Reference: this.viewAllData.referenceNumber,
    });
  }

  getAllViewdata() {
    const data: any = {};
    data['userDetailsId'] = this.mode.userId;

    this.platformUserService
      .getAllViewUserData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.viewAllData = res['responseDto'];
          this.patchpalues();
        }
      });
  }

  getAllCountrys() {
    this.platformUserService
      .getAllCountry()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.AllCountry = res['responseDto'];
        }
      });
  }
  change(value: boolean) {
    this.Active = value;
    this.changeStatus();
  }

  changeStatus() {
    const data: any = {};
    data['isActive'] = this.Active;
    data['email'] = this.mode.emailAddress;

    this.platformUserService
      .changeIsActiveUserA(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }

  save() {
    const selecteCountryObject = this.AllCountry.find(
      (country: any) => country.countryName === this.viewAllData.countryName
    );

    if (selecteCountryObject) {
      // Retrieve the branch name of the selected bank
      this.CountryType = selecteCountryObject.countryId;
      //  this.BankCode = selectedBankObject.bankCode;
    }
    if (!this.edituserform.valid) {
      console.log('working', this.edituserform);
      return this.validateAllFormFields(this.edituserform);
    } else {
      const formData: any = {
        id: this.mode.userId,
        companyName: this.CompanyName?.value,
        companyReg: this.CompanyRegistrationNumber?.value,
        ownerName: this.OwnerName?.value,
        contactNo: this.ContactNumber?.value,
        emailAddress: this.EmailAddress?.value,
        referenceNo: this.Reference?.value,
        address: this.Address?.value,
        country: this.CountryType,
      };

      this.platformUserService
        .updatePlatFormUser(formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          if (res['responseDto']) {
            const msg = res['responseDto'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            });

            this.cancel();
          } else if (res['errors']) {
            console.log('console error', res['errors']);
            const msg = res['errors'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#cc2d2d', color: '#fff' },
            });
          } else {
            this.notificationService.create(
              'success',
              'Success',
              'User Update fail',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }

          console.log('console error', res['errors']);
        });
    }
  }
  cancel() {
    this.modalref.close();
  }

  prev(): void {
    this.currentIndex = 0;
  }

  next() {
    this.currentIndex = this.currentIndex + 1;
  }
}
