import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewApprovalPendingSubAgentComponent } from '../../sub-agent/view-approval-pending-sub-agent/view-approval-pending-sub-agent.component';
import { SendEmailComponent } from '../../platform-users/send-email/send-email.component';
import { Subject, takeUntil } from 'rxjs';
import { UserManagementSubAgentService } from 'src/app/_services/user-management-sub-agent.service';
import { MetaService } from 'src/app/_services/meta.service';
import { ViewVerifyPendingSubAgentComponent } from '../view-verify-pending-sub-agent/view-verify-pending-sub-agent.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { SendEmailSubAgentComponent } from '../send-email-sub-agent/send-email-sub-agent.component';

@Component({
  selector: 'app-approval-pending-sub-agent',
  templateUrl: './approval-pending-sub-agent.component.html',
  styleUrls: ['./approval-pending-sub-agent.component.sass'],
})
export class ApprovalPendingSubAgentComponent {
  switchValue = false;
  pageSize: any = 20;
  pageNumber: any = 1;
  total_records: any;
  currentPageIndex = 1;
  exposableId: any;
  searchType: any = '';

  destroy$: Subject<boolean> = new Subject<boolean>();
  tableDatas: any = [];
  name: any;
  email: any;
  contactNumber: any;
  clientName: any;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private subAgentService: UserManagementSubAgentService,
    private metaService: MetaService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private eventTrigger: EventtriggerService
  ) {}

  ngOnInit(): void {
    this.getAllApprovalPendingSubAgentDetails();
    this.eventTrigger.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'newSub') {
          this.getAllApprovalPendingSubAgentDetails();
        }
      },
    });
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
          this.getAllApprovalPendingSubAgentDetails();
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  getAllApprovalPendingSubAgentDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['userName'] = this.name;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['agentName'] = this.clientName;
    data['searchType'] = 2;

    this.subAgentService
      .getAllSubAgentTableData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableDatas = res['responseDto']['payload'];
            this.total_records = res['responseDto']['totalRecords'];
            console.log('op', this.tableDatas);
          } else {
            this.tableDatas = [];
            this.total_records = 0;
          }
        },
        error: (e: any) => {
          this.tableDatas = [];
        },
      });
  }
  resetName() {
    this.name = '';
    this.getAllApprovalPendingSubAgentDetails();
  }
  reserMail() {
    this.email = '';
    this.getAllApprovalPendingSubAgentDetails();
  }
  reserContact() {
    this.contactNumber = '';
    this.getAllApprovalPendingSubAgentDetails();
  }
  reserAgent() {
    this.clientName = '';
    this.getAllApprovalPendingSubAgentDetails();
  }

  viewApprovalPendingSubAgentById(agentId: any) {
    this.dataService.subAgentPendingData = agentId;
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
    console.log('verifySubAgent', receivedData);

    this.dataService.selectedData = receivedData;
    this.dataService.clickEventStatus = 'viewVerifyPendingSubAgent';
    this.modalService.create({
      nzTitle: 'View Approval Pending Sub Agent',
      nzContent: ViewApprovalPendingSubAgentComponent,
      nzFooter: null,
      nzWidth: 1012,
      nzClassName: 'view-cus-trans',
    });
  }

  userManagement() {
    this.router.navigateByUrl('user-management');
    this.dataService.userManagementSelectedIndex = 2;
  }

  viewExistingSubAgent() {}

  sendEmail(receivedData: any) {
    this.dataService.selectedData = receivedData;
    this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: SendEmailSubAgentComponent,
      nzClassName: 'view-send-email',
      nzFooter: null,
    });
  }

  approve(id: any) {
    const data: any = {};
    data['agentDetailsId'] = id;
    data['status'] = true;
    data['isSubAgent'] = true;
    this.subAgentService.updateStatus(data).subscribe((res: any) => {
      if (res['responseDto']) {
        const msg = res['responseDto']['message'];
        this.notificationService.create(
          'success',
          'Success',
          'Approved Successfully',
          {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          }
        );
        this.eventTrigger.onReloadServiceData('newSub');
      } else if (res['errorDescription']) {
        const msg = res['errorDescription'];
        this.notificationService.create('error', 'Error', msg, {
          nzStyle: { background: '#cc2d2d', color: '#fff' },
        });
      }
    });
  }
  decline(id: any) {
    const data: any = {};
    data['agentDetailsId'] = id;
    data['status'] = false;
    data['isSubAgent'] = true;
    this.subAgentService.updateStatus(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.notificationService.create(
          'success',
          'Success',
          'Declined Successfully',
          {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          }
        );
        this.eventTrigger.onReloadServiceData('newSub');
      } else if (res['errorDescription']) {
        const msg = res['errorDescription'];
        this.notificationService.create('error', 'Error', msg, {
          nzStyle: { background: '#cc2d2d', color: '#fff' },
        });
      }
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllApprovalPendingSubAgentDetails();
  }
}
