import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { MyValidators } from 'src/app/validators/custom-validators';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthserviceService } from 'src/app/_services/authservice.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ResetpasswordComponent } from '../resetpassword/resetpassword.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass'],
})
export class ForgetComponent implements OnInit {
  autoTips: Record<string, Record<string, string>> = {
    // ...en: {},
    default: {},
  };

  public forgotPasswordForm!: FormGroup;

  emailSentSuccess: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NzModalService,
    private authserviceService: AuthserviceService,

    private notificationService: NzNotificationService,
    private router: Router
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
    this.forgotPasswordForm = this.formBuilder.group({
      emailAddress: [
        '',
        [
          customRequired('emailAddress'),
          customEmail(
            '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
            'emailAddress'
          ),
        ],
      ],
    });
  }

  get emailAddress() {
    return this.forgotPasswordForm.get('emailAddress');
  }

  submit() {
    if (!this.forgotPasswordForm.valid) {
      Object.values(this.forgotPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else {
      const formData = {
        username: this.emailAddress?.value,
      };

      this.authserviceService.forgetPasswordRequest(formData).subscribe({
        next: (res: any) => {
          if (res['sucess'] === true) {
            this.emailSentSuccess = res;
            this.notificationService.create(
              'success',
              'Success',
              'email send succesfull',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            // this.router.navigate(['/reset-password']);
          } else if (res['sucess'] === false) {
            const msg = res['msg'];
            this.notificationService.create('error', 'Error', msg, {
              nzStyle: { background: '#cc2d2d', color: '#fff' },
            });
          }
        },
        error: (err) => {
          this.notificationService.create(
            'error',
            'Error',
            'email send failed',
            {
              nzStyle: { background: '#cc2d2d', color: '#fff' },
            }
          );
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
