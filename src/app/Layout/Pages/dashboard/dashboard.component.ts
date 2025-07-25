import { Component } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { ReportService } from 'src/app/_services/report.service';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent {
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
  isCollapsed = false;
  agentData: any;
  privillege: any;
  logo!: string;
  logoUrl!: string;

  exposableId: any;
  id: any;
  userType: any;
  currentUser: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  headerTitle: string = 'Super Admin';
  transactionCountData: any;
  transferCount: any;
  privilagesList: any = [];

  constructor(
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private dashboardService: DashboardService,
    private reportService: ReportService,
    private dataService: DataService,
    private eventtriggerService: EventTriggerService,
    private roleManagemnetService: RolemanagementService
  ) {
    this.currentUser = this.commonService.parseJwt(tokenService.getToken());
    console.log('current user data in Admin', this.currentUser);
  }

  ngOnInit() {
    // this.getAllPrivilages();
    this.logoUrl = 'spoton';
    // this.getPrivillege()
    this.logo = './assets/images/logo1.png';

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Get the active route
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Get the title from the active route's data
        const routeData = route.snapshot.data;
        if (routeData && routeData['title']) {
          this.headerTitle = routeData['title'];
        }
      }
    });

    this.dataService.userName = this.currentUser.sub;
    this.getTransferCount(this.currentUser.sub);

    this.eventtriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'privilages') {
          this.getUserDEtails();
        }
      },
    });

    this.getUserDEtails();
  }

  getUserDEtails() {
    const data: any = {};
    data['username'] = this.currentUser.sub;
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
        next: (res) => {
          if (res['responseDto']) {
            this.privilegeCodes = res['responseDto'];
            this.dataService.privilageCodes = res['responseDto'];
            this.tokenService.savePrivileges(res['responseDto']);

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

  getTransferCount(user: any) {
    const data: any = {};
    data['userName'] = user;
    this.dashboardService.getTransferCount(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.transferCount = res['responseDto']['recordCount'];
        } else {
          this.transferCount = '';
        }
      },
    });
  }
}
