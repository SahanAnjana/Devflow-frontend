import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewSubAgentComponent } from '../../sub-agent/view-sub-agent/view-sub-agent.component';
import { Router } from '@angular/router';
import { SendEmailSubAgentComponent } from '../send-email-sub-agent/send-email-sub-agent.component';
import { UserManagementSubAgentService } from 'src/app/_services/user-management-sub-agent.service';
import { Subject, takeUntil } from 'rxjs';
import { SubAgentService } from 'src/app/_services/sub-agent.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AgentSettingModalComponent } from '../../agent-settings/agent-setting-modal/agent-setting-modal.component';

@Component({
  selector: 'app-sub-agent',
  templateUrl: './sub-agent.component.html',
  styleUrls: ['./sub-agent.component.sass'],
})
export class SubAgentComponent {
  switchValue = false;
  pageSize: any = 10;
  pageNumber: any = 1;
  totalRecords: any;
  currentPageIndex = 1;
  exposableId: any;
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

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private subAgentService: UserManagementSubAgentService,
    private metaService: MetaService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getAllSubAgentDetails();
    console.log('ng on init');
  }

  getExposableId(email: any) {
    const data: any = {};
    data['username'] = email;
    this.metaService
      .getAgentDetailsGetExposableId(data)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.exposableId = res['responseDto']['data'];
          // this.getAllSubAgentNames();
          this.getAllSubAgentDetails();
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllSubAgentDetails();
  }

  getAllSubAgentDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 1;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['agentName'] = this.agentName;
    data['agentAddress'] = this.address;
    data['userName'] = this.userName;

    this.subAgentService
      .getAllSubAgentTableData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableDatas = res['responseDto']['payload'];
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

  resetNameFilter() {
    this.userName = '';
    this.getAllSubAgentDetails();
  }
  resetMailFilter() {
    this.email = '';
    this.getAllSubAgentDetails();
  }
  resetContactFilter() {
    this.contactNumber = '';
    this.getAllSubAgentDetails();
  }
  resetAgentFilter() {
    this.agentName = '';
    this.getAllSubAgentDetails();
  }
  resetAddressFilter() {
    this.address = '';
    this.getAllSubAgentDetails();
  }
  viewNewSubAgent() {
    this.router.navigateByUrl('user-management/view-new-sub-agent');
  }

  viewSubAgentById(agentId: any) {
    this.dataService.subAgentData = agentId;
    agentId &&
      this.subAgentService
        .getSubAgentDetasilsById(agentId.agentDetailsId)
        .subscribe({
          next: (res: any) => {
            if (res['responseDto']) {
              this.viewSubAgentDetails(res['responseDto']);
            }
          },
        });
  }

  viewSubAgentDetails(receivedData: any) {
    console.log('subAgent', receivedData);

    this.dataService.selectedData = receivedData;
    this.dataService.clickEventStatus = 'viewSubAgent';
    this.modalService.create({
      nzTitle: 'View Sub Agent',
      nzContent: ViewSubAgentComponent,
      nzFooter: null,
      nzWidth: 1012,
      nzClassName: 'view-cus-trans',
    });
  }

  sendEmail(receivedData: any) {
    this.dataService.selectedData = receivedData;
    this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: SendEmailSubAgentComponent,
      nzClassName: 'view-send-email',
      nzFooter: null,
    });
  }

  viewAgentPrivillageSettings(type: any, data: any) {
    this.dataService.subAgent = data;

    this.dataService.selectedData = data;
    const model = this.modalService.create({
      // nzTitle: "View Agent Privillage Settings",
      nzContent: AgentSettingModalComponent,
      nzClassName: 'agent-privillage-settings',
      nzWidth: 1203,
      nzFooter: null,
      nzMaskClosable: false,
    });

    // model.afterClose.subscribe({
    //   next: () => {
    //     this.getAllSubAgentDetails();
    //   },
    // });
    model.componentInstance!.type = type;
    // model.componentInstance!.mode = mode;
  }
}
