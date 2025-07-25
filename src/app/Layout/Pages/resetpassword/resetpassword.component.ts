import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthserviceService } from 'src/app/_services/authservice.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { MyValidators } from 'src/app/validators/custom-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.sass'],
})
export class ResetpasswordComponent implements OnInit {
  autoTips: Record<string, Record<string, string>> = {
    // ...en: {},
    default: {},
  };

  resetPasswordToken: any;
  public forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,

    private modalService: NzModalService,
    private authserviceService: AuthserviceService,
    private router: Router,
    private dataservice: DataService,
    private notificationService: NzNotificationService
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
      newPassword: [
        null,
        [
          required,
          pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$'),
          minLength(8),
        ],
      ],
      confiremPassword: [
        null,
        [
          required,
          pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$'),
          minLength(8),
        ],
      ],
    });
  }
  get newPassword() {
    return this.forgotPasswordForm.get('newPassword');
  }
  get confiremPassword() {
    return this.forgotPasswordForm.get('confiremPassword');
  }

  submit() {
    if (!this.forgotPasswordForm.valid) {
      Object.values(this.forgotPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else if (this.newPassword?.value !== this.confiremPassword?.value) {
      this.notificationService.create(
        'error',
        'Error',
        'New Password and Confirm password does not matched',
        {
          nzStyle: { background: '#cc2d2d', color: '#fff' },
        }
      );
    } else {
      const formdata = {
        token: this.dataservice.resetPasswordToken,
        newPassword: this.newPassword?.value,
      };
      this.authserviceService.resetPassword(formdata).subscribe({
        next: (res: any) => {
          if (res['responseDto'] === 'success') {
            this.notificationService.create(
              'success',
              'Success',
              'Password reset successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.router.navigate(['/login']);
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'Password reset Failed',
              {
                nzStyle: { background: '#cc2d2d', color: '#fff' },
              }
            );
          }
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
