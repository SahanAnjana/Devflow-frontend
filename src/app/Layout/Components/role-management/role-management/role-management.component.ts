import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddNewRoleComponent } from '../add-new-role/add-new-role.component';
import { CoreAdminPrivilagesComponent } from '../core-admin-privilages/core-admin-privilages.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { PendingcashService } from 'src/app/_services/pendingcash.service';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.sass'],
})
export class RoleManagementComponent {
  switchValue = false;
  pageNumber = 1;
  pageSize = 10;
  destroy$: Subject<boolean> = new Subject<boolean>();
  roleManagemnetDetails: any;
  isActive: any = true;
  roleActId: any = '';
  currentPageIndex = 1;
  totalRecords: any;
  reportPrivilagesOfUser: any;
  roleId: any;

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private pendingCashService: PendingcashService,
    private roleManagementService: RolemanagementService,
    private notificationService: NzNotificationService,
    private eventrigerService: EventTriggerService
  ) {}

  ngOnInit() {
    this.getAllRoleManagemnetDetails();
  }

  addNewRole() {
    const model = this.modalService.create({
      nzTitle: 'Add New Role',
      nzContent: AddNewRoleComponent,
      nzClassName: 'add-new-role',
      nzFooter: null,
    });
    model.afterClose.subscribe({
      next: () => {
        this.getAllRoleManagemnetDetails();
      },
    });
  }

  coreAdmin(type: any, mode: any) {
    const model = this.modalService.create({
      nzTitle: mode.roleName + ' ' + 'privillages',
      nzContent: CoreAdminPrivilagesComponent,
      nzClassName: 'agent-privillage-settings-role',
      nzWidth: 1013,
      nzFooter: null,
    });

    model.afterClose.subscribe({
      next: () => {
        this.getAllRoleManagemnetDetails();
        this.eventrigerService.onReloadServiceData('privilages');
      },
    });
    model.componentInstance!.type = type;
    model.componentInstance!.mode = mode;
  }

  getAllRoleManagemnetDetails() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.roleManagementService
      .getAllRoleManagemnetData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.roleManagemnetDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
            this.roleId = res['responseDto']['payload']['roleId'];
          } else {
            this.roleManagemnetDetails = [];
            this.totalRecords = 0;
          }
        },
      });
  }

  changeRoleStatus(receivedData: any) {
    const data = {
      isActive: !receivedData.isActive,
      roleId: receivedData.roleId,
    };
    this.roleManagementService.updateRoleStatus(data).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Role Status Updated Successfully',
            '#F45300',
            'Success'
          );
          window.location.reload();
        } else {
          this.createNotifications(
            'Error',
            'Role Status Updating Failed',
            '#F45300',
            'Error'
          );
        }
      },
    });
  }

  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    // console.log('createNotification');
    // title: string, message: string
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllRoleManagemnetDetails();
  }
}
