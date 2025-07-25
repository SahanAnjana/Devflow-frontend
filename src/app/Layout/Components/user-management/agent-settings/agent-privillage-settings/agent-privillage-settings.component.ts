import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-agent-privillage-settings',
  templateUrl: './agent-privillage-settings.component.html',
  styleUrls: ['./agent-privillage-settings.component.sass'],
})
export class AgentPrivillageSettingsComponent {
  subAgentPrivilages: any;

  destroy$: Subject<boolean> = new Subject<boolean>();
  public unsubscribe$ = new Subject<void>();
  currentUser: any;
  privilegeCodes: any;

  @Input() type!: 'subAgent';
  @Input() data: any = {};

  constructor(
    private notificationService: NzNotificationService,
    public modalRef: NzModalRef,
    private subAgentSetting: SubAgentSettingsService,
    private dataService: DataService,
    private roleManagemnetService: RolemanagementService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private dashboardService: DashboardService
  ) {
    this.currentUser = this.commonService.parseJwt(tokenService.getToken());
  }

  ngOnInit() {
    // this.getPrivilages();
    if (this.type === 'subAgent') {
      console.log('type', this.type);
    }

    this.getUserDEtails();
  }

  getUserDEtails() {
    const data: any = {};
    data['username'] = this.dataService.selectedData.email;
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.subAgentPrivilages = res['responseDto'];
            // this.dataService.privilageCodes = res['responseDto'];
            // console.log(this.privilegeCodes);
          }
        },
      });
  }
  // getPrivilages() {
  //   console.log('email', this.dataService.selectedData.email);

  //   const data: any = {};
  //   data['email'] = this.dataService.selectedData.email;

  //   this.subAgentSetting
  //     .getAllPrivilages(data)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((res: any) => {
  //       if (res['responseDto']) {
  //         this.subAgentPrivilages = res['responseDto'];
  //       }
  //     });
  // }
  //updateRolePrivilageStatus
  changeROleStatus(values: any) {
    const formdata: any = {
      rolePrivilegeId: values.rolePrivilegeId,
      isActive: !values.isActive,
      // userId: this.dataService.selectedData.userId,
    };
    this.roleManagemnetService.updateRolePrivilageStatus(formdata).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Role Status Updated Successfully',
            '#F45300',
            'Success'
          );
          // this.getPrivilages();
          this.getUserDEtails();
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

  changeRoleStatus(values: any) {
    const formdata: any = {
      privilegeId: values.privilegeId,
      isActive: !values.isActive,
      userId: this.dataService.selectedData.userId,
    };

    this.subAgentSetting.updatePrivilageStatus(formdata).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Role Status Updated Successfully',
            '#F45300',
            'Success'
          );
          // this.getPrivilages();
          this.getUserDEtails();
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
