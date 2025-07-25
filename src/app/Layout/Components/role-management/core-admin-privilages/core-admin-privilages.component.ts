import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';

@Component({
  selector: 'app-core-admin-privilages',
  templateUrl: './core-admin-privilages.component.html',
  styleUrls: ['./core-admin-privilages.component.sass'],
})
export class CoreAdminPrivilagesComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  reportPrivilages: any;
  accountPrivilages: any;
  userManagePrivilages: any;
  transferPrivilages: any;
  ratePrivilages: any;
  currencyPrivilages: any;
  agentPrivilages: any;
  diagnosticPrivilages: any;
  promotionPrivilages: any;
  pendingcashPrivilages: any;
  transferLimitPrivilages: any;
  makeTransferPrivilages: any;
  roleManagePrivilages: any;
  communictionPrivilages: any;
  checkboxOptions: any[] = [];
  isActive: any = false;
  privilagesOfUser: any;

  statusValue: any;

  @Input() mode: any = {};
  @Input() type!: 'view';

  constructor(
    private notificationService: NzNotificationService,
    public modalRef: NzModalRef,
    private roleManagemnetService: RolemanagementService
  ) {}

  ngOnInit() {
    this.getAllPrivilages();
    if (this.type === 'view') {
      console.log('roleId', this.mode.roleId);
      console.log('type', this.type);
    }

    this.getPrivilagesOfUser();
  }

  getAllPrivilages() {
    const data: any = {};
    data['roleId'] = this.mode.roleId;
    // data['isLogin'] = true;
    this.roleManagemnetService
      .getPrivilagesByuser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.reportPrivilages = res['responseDto']['REPORT'];
            this.accountPrivilages = res['responseDto']['ACCOUNT'];
            this.userManagePrivilages = res['responseDto']['USERMANAGE'];
            this.transferPrivilages = res['responseDto']['TRANSFER'];
            this.ratePrivilages = res['responseDto']['RATE'];
            this.currencyPrivilages = res['responseDto']['CURRENCY'];
            this.agentPrivilages = res['responseDto']['AGENT'];
            this.diagnosticPrivilages = res['responseDto']['DIAGNOSTIC'];
            this.promotionPrivilages = res['responseDto']['PROMOTION'];
            this.pendingcashPrivilages = res['responseDto']['PENDINGCASH'];
            this.transferLimitPrivilages = res['responseDto']['TRANSFERLIMIT'];
            this.makeTransferPrivilages = res['responseDto']['MAKETRANSFER'];
            this.roleManagePrivilages = res['responseDto']['ROLEMANAGE'];
            this.communictionPrivilages = res['responseDto']['COMMUNICATION'];
          }
        },
      });
  }

  getPrivilagesOfUser() {
    const data: any = {};

    data['roleId'] = this.mode.roleId;
    // data['isLogin'] = true;

    this.roleManagemnetService
      .getPrivilagesByuser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.privilagesOfUser = res['responseDto'];
        },
      });
  }

  changeRolePrivilageStatus(receivedData: any) {
    const data = {
      isActive: !receivedData.isActive,
      rolePrivilegeId: receivedData.rolePrivilegeId,
    };

    console.log('data', receivedData.rolePrivilegeId);
    this.roleManagemnetService.updateRolePrivilageStatus(data).subscribe({
      next: (res: any) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Role Status Updated Successfully',
            '#F45300',
            'Success'
          );
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
}
