import { Component } from '@angular/core';
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
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-add-new-platform-users',
  templateUrl: './add-new-platform-users.component.html',
  styleUrls: ['./add-new-platform-users.component.sass'],
})
export class AddNewPlatformUsersComponent {
  addUser!: FormGroup;
  isAvailable: any;
  AllCountry: any;

  public unsubscribe$ = new Subject<void>();
  isUserAvailable: any;
  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private platformUserService: UserManagementPlatformUserService,
    private modalref: NzModalRef,
    private eventTriggerService: EventTriggerService
  ) {}

  ngOnInit() {
    const {
      required,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = MyValidators;
    this.addUser = this.formBuilder.group({
      companyName: [
        null,
        Validators.compose([
          Validators.required,
          customRequired('Company Name'),
          CustomValidators.maxLength(30),
        ]),
      ],
      companyRegistrationNumber: [
        null,
        Validators.compose([
          customRequired('company Registration Number'),
          CustomValidators.maxLength(30),
        ]),
      ],
      ownerName: [
        null,
        Validators.compose([
          customRequired('Owner Name'),
          CustomValidators.maxLength(20),
        ]),
      ],
      contactNumber: [
        null,
        Validators.compose([
          customRequired('contact Number'),
          CustomValidators.maxLength(12),
          CustomValidators.minLength(10),
        ]),
      ],
      address: [
        null,
        Validators.compose([
          customRequired('address'),
          CustomValidators.maxLength(30),
        ]),
      ],
      country: [null, customRequired('country')],

      reference: [
        null,
        Validators.compose([
          Validators.compose([
            customRequired('reference'),
            CustomValidators.maxLength(15),
          ]),
        ]),
      ],
      password: [
        '',
        [
          customRequired('Password'),
          pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$'),
          minLength(8),
        ],
      ],
      confirmPassword: [
        '',
        [
          customRequired('Confirm Password'),
          pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$'),
          minLength(8),
        ],
      ],
      emailAddress: [
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
    });
    this.getAllCountrys();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
          control.markAsDirty();
          control.updateValueAndValidity();
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        } else {
          this.isFieldValid(field);
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

  isFieldValid(field: string) {
    let message: string;
    if (!this.addUser.get(field)!.valid && this.addUser.get(field)!.touched) {
      switch (field) {
        case 'email': {
          message = 'Email must be valid email';
          break;
        }
        case 'password': {
          message =
            'Password must contain at least 8 characters with one Uppercase/ one simple case/ one number/ one special character';
          break;
        }
        case 'confirmPassword': {
          message = 'Passwords must be matched';
          break;
        }
        default: {
          message = 'Input error';
          break;
        }
      }
      // this.notificationService.createNotification('error', message, '#cc2d2d', 'Input Error');
    }
  }
  get CompanyName() {
    return this.addUser.get('companyName');
  }

  get CompanyRegistrationNumber() {
    return this.addUser.get('companyRegistrationNumber');
  }

  get OwnerName() {
    return this.addUser.get('ownerName');
  }
  get ContactNumber() {
    return this.addUser.get('contactNumber');
  }
  get EmailAddress() {
    return this.addUser.get('emailAddress');
  }
  get Address() {
    return this.addUser.get('address');
  }
  get Country() {
    return this.addUser.get('country');
  }
  get Reference() {
    return this.addUser.get('reference');
  }
  get Password() {
    return this.addUser.get('password');
  }
  get confirmPassword() {
    return this.addUser.get('confirmPassword');
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'companyName': {
        return 'Company Name';
      }
      case 'companyRegistrationNumber': {
        return 'Company Registration Number';
      }
      case 'ownerName': {
        return 'Owner Name';
      }
      case 'contactNumber': {
        return 'Contact Number';
      }
      case 'emailAddress': {
        return 'Email Address';
      }
      case 'address': {
        return 'Address';
      }
      case 'country': {
        return 'Country';
      }
      case 'reference': {
        return 'Reference';
      }
      case 'password': {
        return 'Password';
      }
      case 'confirmPassword': {
        return 'Confirm Password';
      }
    }
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
  checkUsername() {
    const data: any = {};
    data['username'] = this.addUser.get('emailAddress')?.value;
    this.platformUserService
      .checkUserName(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.isUserAvailable = res['responseDto']['isNotAvailable'];
        }
        console.log(this.isUserAvailable);
      });
  }
  addNewUser() {
    if (!this.addUser.valid) {
      this.validateAllFormFields(this.addUser);
      return;
    } else if (this.isUserAvailable === true) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Email Address Already Exists',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else if (
      this.addUser.get('password')?.value !=
      this.addUser.get('confirmPassword')?.value
    ) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Password and Confirm Password Does not match',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      // this.validateAllFormFields(this.addUser);
      const body = {
        emailAddress: this.EmailAddress?.value,
        companyName: this.CompanyName?.value,
        companyReg: this.CompanyRegistrationNumber?.value,
        ownerName: this.OwnerName?.value,
        contactNo: this.ContactNumber?.value,
        referenceNo: this.Reference?.value,
        address: this.Address?.value,
        country: this.Country?.value,
        password: this.Password?.value,
        confirmPassword: this.confirmPassword?.value,
        userTypeId: 1,
      };
      this.platformUserService
        .addPlatFormUser(body)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          if (res['responseDto']) {
            const msg = res['responseDto']['msg'];

            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            });
            this.eventTriggerService.onReloadServiceData('addNewPlatformUser');
            this.modalref.destroy();
          } else if (res['errorDescription']) {
            const msg = res['errorDescription'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#cc2d2d', color: '#fff' },
            });
          } else {
            this.notificationService.create(
              'success',
              'Success',
              'User Adding failed',
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
}
