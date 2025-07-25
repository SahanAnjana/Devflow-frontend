import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { CommonsService } from 'src/app/_services/commons.service';
import { SettingService } from 'src/app/_services/setting.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { UntypedFormGroup } from '@angular/forms';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent {
  clientData: any;

  settingsUpdateForm!: UntypedFormGroup;
  userDetails: any;
  getdata: any;
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private commonsService: CommonsService,
    private setting: SettingService,
    private eventTrigger: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.currentUser = this.commonsService.parseJwt(
      this.tokenService.getToken()
    );
  }

  ngOnInit() {
    this.getAllsettingdetail();

    const {
      required,
      customSelectorRequired,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = CustomValidators;

    this.settingsUpdateForm = this.formBuilder.group({
      name: ['', customSelectorRequired('name')],
      email: ['', customSelectorRequired('email')],
      newPassword: [
        '',
        [
          customRequired('Password'),
          pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$'),
          minLength(8),
        ],
      ],
      confirmPassword: ['', customSelectorRequired('confirmpassword')],
    });
    this.settingsUpdateForm.controls['name'].disable();

    this.settingsUpdateForm.controls['email'].disable();
  }

  get name() {
    return this.settingsUpdateForm.get('name');
  }
  get email() {
    return this.settingsUpdateForm.get('email');
  }
  get newPassword() {
    return this.settingsUpdateForm.get('newPassword');
  }
  get confirmPassword() {
    return this.settingsUpdateForm.get('confirmPassword');
  }

  validateForm() {
    Object.values(this.settingsUpdateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  getAllsettingdetail() {
    const data: any = {};
    data['username'] = this.currentUser.sub;
    this.setting.getsettingdetails(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.getdata = res['responseDto'];
      }
      if (this.getdata) {
        this.settingsUpdateForm.patchValue({
          name: this.getdata.ownerName,
          email: this.getdata.emailAddress,
        });
      }
    });
  }
  updatesetting() {
    if (!this.settingsUpdateForm.valid) {
      this.validateForm();

      return;
    } else {
      const data = {
        password: this.newPassword?.value,
        id: this.getdata.id,
      };

      // formData.append('userDto', data.toString());
      if (this.newPassword?.value === this.confirmPassword?.value) {
        this.setting.updatesetting(data).subscribe((res: any) => {
          if (res['responseDto'] != null) {
            this.notificationService.create(
              'success',
              'Setting details Update Successfully',
              ''
            );

            this.eventTrigger.onReloadServiceData();
          } else {
            this.notificationService.create(
              'error',
              'Setting details Update failed',
              ''
            );
          }
        });
      }
    }
  }

  checkPassword() {
    const password = this.newPassword?.value;
    const confirmPassword = this.confirmPassword?.value;

    if (password !== confirmPassword) {
      this.notificationService.create(
        'error',
        'Password and confirmation password do not match',
        ''
      );
    }
  }
}
