import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { MyValidators } from 'src/app/validators/custom-validators';
import { ForgetComponent } from '../forgot-password/forgot-password.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from 'src/app/_services/authservice.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { TFACodeComponent } from '../tfa-code/tfa-code.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  passwordVisible = false;
  error = '';
  resetPasswordToken: any;
  userDetails: any = null;

  private unsubscribe$ = new Subject<void>();
  autoTips: Record<string, Record<string, string>> = {
    en: {},
    default: {},
  };
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dataService: DataService,
    private authService: AuthserviceService,
    private commonService: CommonsService,
    private modalService: NzModalService,
    private tokenService: TokenserviceService,
    private notification: NzNotificationService, // private msgService: NzMessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const {
      required,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = MyValidators;
    this.loginForm = this.formBuilder.group({
      userName: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(
            // tslint:disable-next-line: max-line-length
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            { has: true }
          ),
        ]),
      ],
      password: [
        '',
        [
          customRequired('Password'),
          // pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$'),
          // minLength(8),
        ],
      ],
    });

    if (this.router.url.split('=')[1] !== undefined) {
      if (this.route.snapshot.queryParams['token']) {
        let token = this.route.snapshot.queryParams['token'];
        this.resetPasswordToken = this.router.url.split('=')[1];
        // this.dataService.resetPasswordToken = this.resetPasswordToken;
        token && this.checkResetPasswordTokenValidity();
      }
    }
  }

  checkResetPasswordTokenValidity() {
    if (this.resetPasswordToken) {
      this.dataService.resetPasswordToken = this.resetPasswordToken;
      this.router.navigate(['/reset-password']);
    } else {
      this.notification.create(
        'error',
        'Input Error',
        'Your reset password link is not valid or has expired. Please request a new password reset link.',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    }
  }
  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }
  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  createNotification(type: string, message: string) {}

  send2FaCode() {
    if (!this.loginForm.valid) {
      this.validateFormFields(this.loginForm);
    } else {
      this.dataService.loggedInUser = this.userName?.value;
      this.dataService.loggedInPassword = this.password?.value;
      const formData: any = {
        userName: this.dataService.loggedInUser,
        password: this.dataService.loggedInPassword,
        grantType: 'Core Admin',
      };

      this.authService.getTfaCode(formData).subscribe((res: any) => {
        if (res['responseDto']) {
          this.notification.create('success', 'Success', res['responseDto'], {
            nzStyle: {
              background: '#00A03E',
              color: '#ffffff',
            },
          });

          this.otpOpen();
        } else if (res['errorDescription']) {
          this.notification.create('error', 'Error', res['errorDescription'], {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        } else {
          this.notification.create('error', 'Error', '2FA Code send failed', {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
    }
  }

  verify() {
    const formData = {
      username: this.loginForm?.value.userName,
      password: this.loginForm?.value.password,
      // grantType: 'Core Admin',
    };
    this.authService.login(formData).subscribe({
      next: (data: any) => {
        if (data.access_token) {
          this.tokenService.saveToken(data.access_token);
          this.tokenService.saveRefreshToken(data.refresh_token);
          this.dataService.loggedInUser = this.loginForm?.value.userName;
          this.dataService.loggedInPassword = this.loginForm?.value.password;
          this.getUserDetailsByme();
          this.router.navigateByUrl('');
        } else if (data['errorDescription']) {
          // this.notificationService.create(
          //   'error',
          //   'Error',
          //   data['errorDescription'],
          //   { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          // );
        }
      },
      error: () => {
        // this.notificationService.create(
        //   'error',
        //   'Error',
        //   'Please enter valid OTP',
        //   { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        // );
      },
    });
    // this.modalRef.destroy();
  }

  getUserDetailsByme() {
    this.authService.getUsersDetialsBy().subscribe((res: any) => {
      this.userDetails = res;
      this.dataService.userDetails = this.userDetails;
      console.log('this.userDetails', this.userDetails);
    });
  }

  otpOpen() {
    this.modalService.create({
      // nzTitle: 'Forgot your Password?',
      nzContent: TFACodeComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 390,
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'userName': {
        return 'User Name';
      }
      case 'password': {
        return 'Password';
      }
    }
  }
  createNotifications(
    type: string,
    content: string,

    title: string
  ): void {
    // title: string, message: string
    this.notification.create(type, title, content, {
      nzStyle: {
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }
  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.loginForm.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          const fieldName = this.getFieldName(field);
          if (fieldName === 'User Name') {
            if (
              this.loginForm.get('userName')?.value === null ||
              this.loginForm.get('userName')?.value === ''
            ) {
              this.notification.create(
                'error',
                'Input Error',
                'Username cannot be empty',
                { nzStyle: { background: '#cc2d2d', color: '#fff' } }
              );
            } else if (this.loginForm.get('userName')?.value != null) {
              this.notification.create(
                'error',
                'Input Error',
                'Username must be valid',
                { nzStyle: { background: '#cc2d2d', color: '#fff' } }
              );
            }
          } else {
            this.notification.create(
              'error',
              'Input Error',
              fieldName + ' cannot be empty',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        }
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    });
  }
}
