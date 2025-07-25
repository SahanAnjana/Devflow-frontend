import { Component, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewApprovalPendingAffiliateComponent } from '../view-approval-pending-affiliate/view-approval-pending-affiliate.component';
import { AffiliateSendEmailComponent } from '../affiliate-send-email/affiliate-send-email.component';
import { Router } from '@angular/router';
import { UsermanagementAffliateNewAffliateService } from 'src/app/_services/usermanagement-affliate-new-affliate.service';
import { Subject, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { DeclinedAffiliateComponent } from '../declined-affiliate/declined-affiliate.component';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';

@Component({
  selector: 'app-approval-pending-affiliate',
  templateUrl: './approval-pending-affiliate.component.html',
  styleUrls: ['./approval-pending-affiliate.component.sass'],
})
export class ApprovalPendingAffiliateComponent {
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;

  @ViewChild('DeclinedAffiliateComponent')
  declinedAffiliateComponent: DeclinedAffiliateComponent | undefined;

  approvePendingData: any;
  totalRecords: any;

  public unsubscribe$ = new Subject<void>();

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private affliateNewAffliateService: UsermanagementAffliateNewAffliateService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService
  ) {}

  ngOnInit() {
    this.getAllTableData();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'affiliate') {
          this.getAllTableData();
        }
      },
    });
  }

  getAllTableData() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['isApproved'] = '';
    data['pageSize'] = this.pageSize;
    data['searchType'] = 2;
    this.affliateNewAffliateService
      .getApprovePendingAllData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.approvePendingData = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
        } else {
          this.approvePendingData = [];
        }
      });
  }

  viewApprovalPending(mode: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Approval Pending Affiliate',
      nzContent: ViewApprovalPendingAffiliateComponent,
      nzClassName: 'view-approval-pending',
      nzFooter: null,
    });
    modal.componentInstance!.mode = mode;
  }

  userManagement() {
    this.router.navigateByUrl('user-management');
    this.dataService.userManagementSelectedIndex = 6;
  }

  viewAffiliateSendEmail(valus: any) {
    const modal = this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: AffiliateSendEmailComponent,
      nzClassName: 'view-send-email',
      nzFooter: null,
    });
    modal.componentInstance!.mode = valus;
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllTableData();
  }

  approveStatusUpdate(values: any) {
    const data: any = {};
    data['agentDetailsId'] = values.agentDetailsId;
    data['approveStatus'] = true;

    this.affliateNewAffliateService
      .approveStatusUpdate(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto']['message'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
          this.eventTriggerService.onReloadServiceData('affiliate');
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }

  declineStatusUpdate(values: any) {
    const data: any = {};
    data['agentDetailsId'] = values.agentDetailsId;
    data['approveStatus'] = false;

    this.affliateNewAffliateService
      .declineStatusUpdate(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto']['message'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
          this.eventTriggerService.onReloadServiceData('affiliate');
          // this.declinedAffiliateComponent?.getAllDeclineData();
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }
}
