import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.sass'],
})
export class UserManagementComponent {
  currentUser: any;
  privilegeCodes: any;
  privileges: any = {
    CORE_SHOW_USER_MANAGEMENT_PLATFORM_USERS: false,
    CORE_SHOW_USER_MANAGEMENT_AGENTS: false,
    CORE_SHOW_USER_MANAGEMENT_CUSTOMERS: false,
    CORE_SHOW_USER_MANAGMENT_CORPORATE: false,
    CORE_SHOW_USER_MANAGEMENT_BENEFICIARY: false,
    CORE_SHOW_USER_MANAGEMENT_AFFILIATE_TAB: false,
    CORE_SHOW_USER_MANAGEMENT_AGENT_CUSTOMER: false,
    CORE_SHOW_USER_MANAGEMENT_SUBAGENT: false,
  };
  allPrivilages: any;

  constructor(
    public dataService: DataService,
    private router: Router,
    private eventriggerservice: EventTriggerService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private dashboardService: DashboardService,
    private roleManagemnetService: RolemanagementService
  ) {
    this.currentUser = this.commonService.parseJwt(tokenService.getToken());
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      this.privileges.CORE_SHOW_USER_MANAGEMENT_SUBAGENT = true;
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_PLATFORM_USERS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_PLATFORM_USERS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_AGENTS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_AGENTS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_CUSTOMERS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_CUSTOMERS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGMENT_CORPORATE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGMENT_CORPORATE = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_BENEFICIARY') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_BENEFICIARY = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_AFFILIATE_TAB') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_AFFILIATE_TAB = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_USER_MANAGEMENT_AGENT_CUSTOMER') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_USER_MANAGEMENT_AGENT_CUSTOMER = true)
          : false;
      }
    });
  }
}
