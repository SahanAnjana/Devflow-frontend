import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddNewRoleComponent } from '../../../role-management/add-new-role/add-new-role.component';
import { CoreAdminPrivilagesComponent } from '../../../role-management/core-admin-privilages/core-admin-privilages.component';
import { AddNewPlatformUsersComponent } from '../add-new-platform-users/add-new-platform-users.component';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';
import { PlatformUsersModalComponent } from '../platform-users-modal/platform-users-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';

@Component({
  selector: 'app-view-new-platform-users',
  templateUrl: './view-new-platform-users.component.html',
  styleUrls: ['./view-new-platform-users.component.sass'],
})
export class ViewNewPlatformUsersComponent {
  switchValue = false;

  tableData = [
    {
      roleName: 'Anoojan',
      roleDescription: 'Front-End Developer',
    },
    { roleName: 'Nimal', roleDescription: 'Front-End Developer' },
    {
      roleName: 'Ragavan',
      roleDescription: 'Front-End Developer',
    },
    {
      roleName: 'Anojan',
      roleDescription: 'Front-End Developer',
    },
    {
      roleName: 'loga',
      roleDescription: 'Front-End Developer',
    },
  ];

  pageNumber = 1;
  pageSize = 10;
  selectedEmail: any;
  allNewPlatFormusers: any;
  totalRecords: any;

  public unsubscribe$ = new Subject<void>();
  currentPageIndex = 1;
  email: any;
  selectedUserName: any;
  username: any;
  userDetails: any;
  id: any;
  selectedUsername: any;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private platformUserService: UserManagementPlatformUserService,
    private notification: NzNotificationService,
    private dataService: DataService,
    private eventTriggerService: EventTriggerService
  ) {}
  ngOnInit() {
    this.getNewUsers();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'addNewPlatformUser') {
          this.getNewUsers();
        }
      },
    });
  }
  userManagement() {
    this.dataService.userManagementSelectedIndex = 0;
    this.router.navigateByUrl('user-management');
  }

  addNewUser() {
    const modal = this.modalService.create({
      nzTitle: 'Add New User',
      nzContent: AddNewPlatformUsersComponent,
      nzClassName: 'add-new-role',
      nzFooter: null,
      nzWidth: 910,
    });
    modal.afterClose.subscribe((res: any) => {
      if (res) {
        this.getNewUsers();
      }
    });
  }

  getNewUsers() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['email'] = this.selectedEmail;
    data['username'] = this.username;
    this.platformUserService
      .getAllNewPlatformUserData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.allNewPlatFormusers = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
          // this.pageSize = res['responseDto']['pageSize'];
        }
      });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getNewUsers();
  }
  filterByEmail() {
    if (this.email) {
      this.selectedEmail = this.email;
    } else {
      this.selectedEmail = '';
    }
    this.getNewUsers();
  }

  filterByUserName() {
    if (this.username) {
      this.selectedUsername = this.username;
    } else {
      this.selectedUsername = '';
    }
    this.getNewUsers();
  }
  resetSearch() {
    this.selectedEmail = '';
    this.email = '';
    this.selectedUserName = '';
    this.username = '';
    this.getNewUsers();
  }

  getDetailsbyId(id: any) {
    this.id = id;
    const data: any = {};
    data['userId'] = id;
    this.platformUserService
      .getUserDetailsById(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.userDetails = res['responseDto'];
          this.viewuseredit(this.userDetails);
        }
      });
  }

  viewuseredit(mode: any) {
    const modal = this.modalService.create({
      nzTitle: 'View User',
      nzContent: PlatformUsersModalComponent,
      nzClassName: 'view-platform-user',
      nzFooter: null,
      nzWidth: 1012,
    });
    modal.componentInstance!.mode = mode;
    modal.componentInstance!.id = this.id;
    modal.afterClose.subscribe((res: any) => {
      this.getNewUsers();
    });
  }

  approveStatus(id: any) {
    const data: any = {};
    data['userId'] = id;
    data['status'] = true;
    this.platformUserService.approveAgent(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'User Approved successfully',
          '#ffffff',
          '#00A03E'
        );

        this.getNewUsers();
      } else {
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  declineStatus(id: any) {
    const data: any = {};
    data['userId'] = id;
    data['status'] = false;
    this.platformUserService.approveAgent(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'User Declined successfully',
          '#ffffff',
          '#00A03E'
        );
        this.getNewUsers();
      } else {
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }

  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notification.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
}
