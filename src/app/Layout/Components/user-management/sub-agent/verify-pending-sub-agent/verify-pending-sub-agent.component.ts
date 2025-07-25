import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewVerifyPendingSubAgentComponent } from '../view-verify-pending-sub-agent/view-verify-pending-sub-agent.component';
import { Subject, takeUntil } from 'rxjs';
import { UserManagementSubAgentService } from 'src/app/_services/user-management-sub-agent.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Location } from '@angular/common';
@Component({
  selector: 'app-verify-pending-sub-agent',
  templateUrl: './verify-pending-sub-agent.component.html',
  styleUrls: ['./verify-pending-sub-agent.component.sass'],
})
export class VerifyPendingSubAgentComponent {
  switchValue = false;
  pageSize: any = 20;
  pageNumber: any = 1;
  total_records: any;
  currentPageIndex = 1;
  exposableId: any;
  searchType: any = '';

  destroy$: Subject<boolean> = new Subject<boolean>();
  tableDatas: any = [];

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private subAgentService: UserManagementSubAgentService,
    private metaService: MetaService,
    private location: Location,
    private dataService: DataService,
    private agentCustomerDataService: AgentCustomerService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getAllVerifyPendingSubAgentDetails();
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
          this.getAllVerifyPendingSubAgentDetails();
        },
        error: () => {
          console.log('not working', this.exposableId);
        },
      });
  }

  getAllVerifyPendingSubAgentDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 5;

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

  // viewVerifyPendingSubAgent(receivedData: any) {
  //   console.log('subAgent', receivedData);

  //   this.dataService.selectedData = receivedData;
  //   this.dataService.clickEventStatus = 'viewSubAgent';
  //   this.modalService.create({
  //     nzTitle: 'View Verify Pending Sub Agent',
  //     nzContent: ViewVerifyPendingSubAgentComponent,
  //     nzClassName: 'view-sub-agent',
  //     nzFooter: null,
  //   });
  // }

  viewVerifyPendingSubAgentById(agentId: any) {
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
      nzTitle: 'View Verify Pending Sub Agent',
      nzContent: ViewVerifyPendingSubAgentComponent,
      nzFooter: null,
      nzWidth: 1012,
      nzClassName: 'view-cus-trans',
    });
  }

  // userManagement() {
  //   this.router.navigateByUrl('dashboard/user-management');
  //   this.dataService.selectedIndex = 0;
  // }

  viewExistingSubAgent() {
    this.router.navigateByUrl('user-management');
    this.dataService.userManagementSelectedIndex = 2;
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllVerifyPendingSubAgentDetails();
  }

  sendEmail(data: any) {
    this.agentCustomerDataService.sendVerifyLink(data.email).subscribe(
      (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Verify mail send successfully',
            { nzStyle: { background: '#00A03E' } }
          );
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d' } }
          );
        }
      },
      () => {
        this.notificationService.create(
          'error',
          'Error',
          'Verify mail send failed',
          { nzStyle: { background: '#cc2d2d' } }
        );
      }
    );
  }
}
