import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';

@Component({
  selector: 'app-platform-user-privillage',
  templateUrl: './platform-user-privillage.component.html',
  styleUrls: ['./platform-user-privillage.component.sass'],
})
export class PlatformUserPrivillageComponent {
  @Input() mode: any = {};
  allRoles: any;
  public unsubscribe$ = new Subject<void>();
  rolePrivilages: any;
  privilageStatus: any;
  userRoleForm!: FormGroup;
  selectedRoleId = '';
  public privilage!: FormGroup;
  constructor(
    private platformUserService: UserManagementPlatformUserService,
    private notificationService: NzNotificationService,
    private fb: FormBuilder,
    private modal: NzModalRef,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.getAllRole();
    this.selectedRoleId = this.mode.roleId;
    this.selectedRole(this.mode.roleId);
  }
  switchValue = false;

  getAllRole() {
    this.platformUserService
      .getAllRole()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.allRoles = res['responseDto'];
        }
      });
  }
  selectedRole(id: any) {
    this.selectedRoleId = id;
    const data: any = {};
    data['id'] = id;
    return this.platformUserService
      .getRoleById(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.rolePrivilages = res['responseDto'];
        } else {
          this.rolePrivilages = [];
        }
      });
  }
  assign() {
    if (this.selectedRoleId === '') {
      return this.notificationService.create(
        'error',
        'Input Error',
        'Please select the Role',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      const data: any = {};
      data['roleId'] = this.selectedRoleId;
      data['email'] = this.dataService.userName;
      data['asigineeUserName'] = this.mode.emailAddress;
      return this.platformUserService
        .assignRole(data)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          if (res['responseDto']) {
            const msg = res['responseDto'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            });
          } else {
            this.notificationService.create(
              'error',
              'Error',
              res['errorDescription'],
              {
                nzStyle: { background: '#cc2d2d', color: '#ffffff' },
              }
            );
          }
        });
    }
  }
  close() {
    this.modal.destroy();
  }
}
