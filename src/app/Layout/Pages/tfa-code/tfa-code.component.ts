import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { AuthserviceService } from 'src/app/_services/authservice.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-tfa-code',
  templateUrl: './tfa-code.component.html',
  styleUrls: ['./tfa-code.component.sass'],
})
export class TFACodeComponent {
  entered2faCode: any;
  otpForm!: FormGroup;
  color = '#868686';
  display: any;
  btnDisable = false;
  public timerInterval: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  useremail: any;

  privileges: any = {
    CORE_SHOW_REPORTS_NAV: false,
    CORE_SHOW_USER_MANAGEMENT_NAV: false,
    CORE_SHOW_TRANSFERS_NAV: false,
    CORE_SHOW_RATE_SETTINGS_NAV: false,
    CORE_SHOW_DIAGNOSTIC_NAV: false,
    CORE_SHOW_PROMOTION_NAV: false,
    CORE_SHOW_PENDING_CASH_NAV: false,
    CORE_SHOW_TRANSFER_LIMIT_NAV: false,
    CORE_SHOW_MAKE_TRANSFER_NAV: false,
    CORE_SHOW_ROLE_MANAGEMENT_NAV: false,
    CORE_SHOW_COMMUNICATION_NAV: false,
  };

  privilegeCodes: any;
  privilagesList: any;

  constructor(
    public authService: AuthserviceService,
    private notificationService: NzNotificationService,
    // private tokenStorage: TokenStorageServiceService,
    private route: Router,
    private dataService: DataService,
    private modalRef: NzModalRef,
    private tokenService: TokenserviceService,
    private eventTrigger: EventTriggerService,
    private modalService: NzModalService,
    private dashboardService: DashboardService,
    private roleManagemnetService: RolemanagementService
  ) {}

  ngOnInit(): void {
    this.useremail = this.dataService.loggedInUser;
    this.start();
  }

  onOtpChange($event: any) {
    if ($event.length === 4) {
      this.entered2faCode = $event;
    }
  }

  start() {
    clearInterval(this.timerInterval);
    this.btnDisable = false;
    this.color = '#868686';
    this.timer(5);
  }
  stop() {
    clearInterval(this.timerInterval);
  }
  resend() {
    this.start();
    // this.generateOTP();
  }
  cancel() {
    this.route.navigate(['/login']);
    this.modalRef.close();
  }

  validateFormFields(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  verify() {
    if (isNaN(this.entered2faCode)) {
      this.notificationService.create(
        'error',
        'Error',
        'Please Enter Valid OTP',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      const formData = {
        username: this.dataService.loggedInUser,
        password: this.dataService.loggedInPassword,
        grantType: 'Core Admin',
        otp: this.entered2faCode,
      };
      this.authService.login(formData).subscribe({
        next: (data: any) => {
          if (data.jwttoken) {
            this.tokenService.saveToken(data.jwttoken);
            this.tokenService.saveRefreshToken(data.refreshToken);
            this.route.navigateByUrl('');
            this.closeModal();
            this.getUserDEtails();
          } else if (data['errorDescription']) {
            this.notificationService.create(
              'error',
              'Error',
              data['errorDescription'],
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        },
        error: () => {
          this.notificationService.create(
            'error',
            'Error',
            'Please enter valid OTP',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        },
      });
      // this.modalRef.destroy();
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds < 30) {
        this.color = 'red';
      }
      if (seconds == 0) {
        console.log('finished');

        this.btnDisable = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  generateOTP() {
    const formData: any = {
      userName: this.dataService.loggedInUser,
      password: this.dataService.loggedInPassword,
      grantType: 'Core Admin',
    };

    this.authService.getTfaCode(formData).subscribe((res: any) => {
      if (res['responseDto']) {
        this.notificationService.create(
          'success',
          'Success',
          res['responseDto'],
          {
            nzStyle: {
              background: '#00A03E',
              color: '#ffffff',
            },
          }
        );
        this.start();
      } else if (res['errorDescription']) {
        this.notificationService.create(
          'error',
          'Error',
          res['errorDescription'],
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      } else {
        this.notificationService.create(
          'error',
          'Error',
          '2FA Code send failed',
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      }
    });
  }

  getUserDEtails() {
    const data: any = {};
    data['username'] = 'user@mxpbx.com';
    this.dashboardService.getuserdetails().subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.getAdminPrivilages(res['responseDto']['roleId']);
        }
      },
    });
  }
  getAdminPrivilages(roleid: any) {
    const data: any = {};
    data['roleId'] = roleid;
    data['isLogin'] = true;
    this.roleManagemnetService
      .getPrivilagesByuser(data)

      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.privilegeCodes = res['responseDto'];
            this.dataService.privilageCodes = res['responseDto'];
            this.tokenService.savePrivileges(res['responseDto']);
            console.log(this.privilegeCodes);
            this.privilegeCodes.forEach((data: any) => {
              if (data.privilegeCode == 'CORE_SHOW_REPORTS_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_REPORTS_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_TRANSFERS_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_TRANSFERS_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_RATE_SETTINGS_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_RATE_SETTINGS_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_DIAGNOSTIC_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_DIAGNOSTIC_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_PROMOTION_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_PROMOTION_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_PENDING_CASH_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_PENDING_CASH_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_TRANSFER_LIMIT_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_TRANSFER_LIMIT_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_MAKE_TRANSFER_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_MAKE_TRANSFER_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_ROLE_MANAGEMENT_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_ROLE_MANAGEMENT_NAV = true)
                  : false;
              }
              if (data.privilegeCode == 'CORE_SHOW_COMMUNICATION_NAV') {
                data.isActive == true
                  ? (this.privileges.CORE_SHOW_COMMUNICATION_NAV = true)
                  : false;
              }
            });
          } else {
            console.log('privilages not working');
            this.privilagesList = '';
          }
        },
      });
  }
  // getAdminUserDetails() {
  //   this.userService.getAdminUserDetails().subscribe({
  //     next: (res) => {
  //       this.tokenStorage.saveUser(res);
  //       if (res.roleDto.isActive) {
  //         this.tokenStorage.savePrivileges(res.roleDto.privilegeDtoList);
  //         this.redirectToActiveModule(
  //           JSON.parse(sessionStorage.getItem('privileges')!)
  //         );
  //       } else {
  //         //notication error
  //         this.route.navigateByUrl('/');
  //       }
  //     },
  //   });
  // }
}
