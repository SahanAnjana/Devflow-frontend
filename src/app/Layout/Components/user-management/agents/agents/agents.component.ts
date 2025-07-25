import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewAgentComponent } from '../view-agent/view-agent.component';
import { AddNewAgentComponent } from '../add-new-agent/add-new-agent.component';
import { AgentSettingModalComponent } from '../../agent-settings/agent-setting-modal/agent-setting-modal.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { UserManagementAgentService } from 'src/app/_services/user-management-agent.service';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from 'src/app/_services/agent.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.sass'],
})
export class AgentsComponent {
  privileges: any = {
    CORE_SHOW_AGENT_STATUS_BUTTON: false,
    CORE_SHOW_AGENT_CUSTOMER_STATUS: false,
    CORE_SHOW_AGENT_SETTING: false,
    CORE_SHOW_AGENT_VIEW: false,
    CORE_SHOW_ADD_NEW_AGENT: false,
    CORE_SHOW_AGENT_STATUS: false,
    CORE_SHOW_AGENT_APPROVE: false,
  };
  switchValue = false;
  isAgentUser: any;
  pageSize: any = 10;
  pageNumber: any = 1;
  totalRecords: any;
  currentPageIndex = 1;
  searchType: any = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  tableDatas: any = [];
  subAgentService1: any;
  subAgnetData: any;
  address: any;
  agentName: any;
  contactNumber: any;
  email: any;
  userName: any;
  registeredFromDate: any;
  registeredToDate: any;
  status: any;
  usernamangementPrivilage: any = [];
  public unsubscribe$ = new Subject<void>();
  allPrivilages: any;
  constructor(
    private modalService: NzModalService,
    private dataService: DataService,
    private agentService: UserManagementAgentService,
    private agentSer: AgentService,
    private notificationService: NzNotificationService,
    private eventTriggerService: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.usernamangementPrivilage;
    this.getAllAgentDetails();
    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_AGENT_STATUS_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_STATUS_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_STATUS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_STATUS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_SETTING') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_SETTING = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_VIEW') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_VIEW = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_ADD_NEW_AGENT') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_ADD_NEW_AGENT = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_STATUS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_STATUS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_APPROVE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_APPROVE = true)
          : false;
      }
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllAgentDetails();
  }

  resetNameFilter() {
    this.userName = '';
    this.getAllAgentDetails();
  }
  resetMailFilter() {
    this.email = '';
    this.getAllAgentDetails();
  }
  resetContactFilter() {
    this.contactNumber = '';
    this.getAllAgentDetails();
  }
  getAllAgentDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['contactNumber'] = this.contactNumber;
    data['email'] = this.email;
    data['address'] = this.address;
    // data['isAgentUser'] = true;
    // data['searchType'] = this.searchType;
    data['registeredFromDate'] = this.registeredFromDate;
    data['registeredToDate'] = this.registeredToDate;
    data['userName'] = this.userName;
    data['status'] = this.status;
    data['isAgentUser'] = true;

    this.agentService
      .getAllAgentTableData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableDatas = res['responseDto']['payload'];
            console.log('agentDetails', this.tableDatas);

            this.totalRecords = res['responseDto']['totalRecords'];

            console.log('op', this.tableDatas);
          } else {
            this.tableDatas = [];
            this.totalRecords = 0;
          }
        },
        error: (e: any) => {
          this.tableDatas = [];
        },
      });
  }

  changeStatus(receivedData: any) {
    const data = {
      status: !receivedData.isActive,
      agentDetailsId: receivedData.agentDetailsId,
    };
    this.agentSer.updateAgentStatus(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Status updated successfully',
            'Success',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
        this.getAllAgentDetails();
      },
    });
  }
  approveStatus(receivedData: any) {
    const data = {
      status: !receivedData.isApprove,
      agentDetailsId: receivedData.agentDetailsId,
      isSubAgent: true,
    };
    this.agentSer.updateAgentApproveStatus(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Status updated successfully',
            'Success',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
        this.getAllAgentDetails();
      },
    });
  }
  viewAgentPrivillageSettings(receivedData: any) {
    this.dataService.selectedData = receivedData;
    const model = this.modalService.create({
      // nzTitle: "View Agent Privillage Settings",
      nzContent: AgentSettingModalComponent,
      nzClassName: 'agent-privillage-settings',
      nzFooter: null,
    });

    model.afterClose.subscribe({
      next: () => {
        this.eventTriggerService.onReloadServiceData('privilages');
      },
    });
  }

  viewAgentDetails(receivedData: any) {
    console.log('ViewwAgentDetails', receivedData);
    this.dataService.selectedData = receivedData;

    const modal = this.modalService.create({
      nzContent: AddNewAgentComponent,
      nzFooter: null,
      nzClassName: 'add-agent',
      nzWidth: 1012,
    });
    modal.afterClose.subscribe((res) => {
      this.getAllAgentDetails();
    });
  }

  viewAgentById(recevieddata: any) {
    this.dataService.clickEventStatus = 'viewAgent';
    console.log(recevieddata);
    const data: any = {};
    data['agentId'] = recevieddata.agentDetailsId;
    this.agentService.getAgentDetasilsById(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.viewAgentDetails(res['responseDto']);
        }
      },
    });
  }

  addnewAgent() {
    this.dataService.selectedData = null;
    this.dataService.clickEventStatus = 'addNewAgent';
    const modal = this.modalService.create({
      nzContent: AddNewAgentComponent,
      nzFooter: null,
      nzClassName: 'add-agent',
      nzWidth: 1012,
    });
    modal.afterClose.subscribe((res) => {
      this.getAllAgentDetails();
    });
  }
  unlockUser(email: any) {
    console.log(email);
    const data: any = {};
    data['email'] = email.email;
    this.agentService
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
}
