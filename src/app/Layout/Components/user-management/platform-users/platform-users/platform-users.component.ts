import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PlatformUsersModalComponent } from '../platform-users-modal/platform-users-modal.component';
import { PlatformUserPrivillageComponent } from '../platform-user-privillage/platform-user-privillage.component';
import { ViewExistingPlatformUserComponent } from '../view-existing-platform-user/view-existing-platform-user.component';
import { ViewApprovalPendingComponent } from '../view-approval-pending/view-approval-pending.component';
import { SendEmailComponent } from '../send-email/send-email.component';

import { EditUserComponent } from '../../edit-user/edit-user.component';
import { Router } from '@angular/router';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-platform-users',
  templateUrl: './platform-users.component.html',
  styleUrls: ['./platform-users.component.sass'],
})
export class PlatformUsersComponent {
  switchValue = false;

  email: any;
  username: any;

  pageNumber = 1;
  pageSize = 10;
  totalRecords: any;

  allPlatFormusers: any;
  selectedEmail: any;
  selectedUserName: any;

  agentUser: any;

  public unsubscribe$ = new Subject<void>();
  currentPageIndex = 1;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private platformUserService: UserManagementPlatformUserService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private notificationService: NzNotificationService,
    private dataServise: DataService
  ) {
    this.agentUser = commonService.parseJwt(tokenService.getToken());
  }

  ngOnInit() {
    this.getAllTableDataForPlatformUser();
  }

  getAllTableDataForPlatformUser() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['email'] = this.email;
    data['username'] = this.username;
    this.platformUserService
      .getAllPlatformUserTableData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.allPlatFormusers = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
        }
      });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllTableDataForPlatformUser();
  }
  filterByEmail() {
    if (this.email) {
      this.selectedEmail = this.email;
    } else {
      this.selectedEmail = '';
    }
    this.getAllTableDataForPlatformUser();
  }

  filterByUserName() {
    if (this.username) {
      this.selectedUserName = this.username;
    } else {
      this.selectedUserName = '';
    }
    this.getAllTableDataForPlatformUser();
  }
  resetSearch() {
    this.selectedEmail = '';
    this.email = '';
    this.selectedUserName = '';
    this.username = '';
    this.getAllTableDataForPlatformUser();
  }

  changeStatus(value: any) {
    const data: any = {};
    data['isActive'] = value.isActive;
    data['email'] = value.emailAddress;

    this.platformUserService
      .changeIsActiveUserA(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
          this.getAllTableDataForPlatformUser();
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }

  unlockUser(email: any) {
    const data: any = {};
    data['email'] = email.emailAddress;
    this.platformUserService
      .unlockUser(data)
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

  viewuseredit(mode: any) {
    this.dataServise.newIsActive = mode.isActive;
    const modal = this.modalService.create({
      nzTitle: 'View/Edit User',
      nzContent: EditUserComponent,
      nzClassName: 'view-modal-user',
      nzFooter: null,
    });
    modal.componentInstance!.mode = mode;
    modal.afterClose.subscribe((res: any) => {
      this.getAllTableDataForPlatformUser();
    });
  }

  viewUserPrivillage(mode: any) {
    const modal = this.modalService.create({
      nzTitle: 'Platform User Privillage',
      nzContent: PlatformUserPrivillageComponent,
      nzClassName: 'view-modal-privillage',
      nzFooter: null,
    });
    modal.componentInstance!.mode = mode;
  }

  viewExistingPlatformUsers() {
    this.modalService.create({
      nzTitle: 'View New Platform Users',
      nzContent: ViewExistingPlatformUserComponent,
      nzClassName: 'view-existing-user',
      nzFooter: null,
    });
  }

  viewNewPlatformUsers() {
    this.router.navigateByUrl('user-management/view-new-platform-user');
  }
}
