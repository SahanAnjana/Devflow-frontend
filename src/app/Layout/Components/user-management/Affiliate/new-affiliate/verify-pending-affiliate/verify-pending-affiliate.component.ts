import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewApprovalPendingAffiliateComponent } from '../view-approval-pending-affiliate/view-approval-pending-affiliate.component';
import { Router } from '@angular/router';
import { UsermanagementAffliateNewAffliateService } from 'src/app/_services/usermanagement-affliate-new-affliate.service';
import { Subject, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';

@Component({
  selector: 'app-verify-pending-affiliate',
  templateUrl: './verify-pending-affiliate.component.html',
  styleUrls: ['./verify-pending-affiliate.component.sass'],
})
export class VerifyPendingAffiliateComponent {
  pageNumber = 1;
  pageSize = 20;
  AllData: any;
  totalRecords: any;
  currentPageIndex = 1;

  public unsubscribe$ = new Subject<void>();
  constructor(
    private modalService: NzModalService,
    private router: Router,
    private usermanagementAffliateNewAffliateService: UsermanagementAffliateNewAffliateService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService
  ) {}

  ngOnInit() {
    this.getAllVerifyPendingData();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'affiliate') {
          this.getAllVerifyPendingData();
        }
      },
    });
  }

  getAllVerifyPendingData() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 5;

    this.usermanagementAffliateNewAffliateService
      .verifyPndingAllData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.AllData = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
        } else {
          this.AllData = [];
        }
      });
  }

  sendMailAgain(values: any) {
    const data: any = {};
    data['username'] = values.email;

    this.usermanagementAffliateNewAffliateService
      .sendMailVarify(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto'];
          this.notificationService.create(
            'success',
            'Success',
            'Send Mail Successfully',
            {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            }
          );
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }

  viewVerifyPendingAffiliate(mode: any, type: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Verify Pending Affiliate',
      nzContent: ViewApprovalPendingAffiliateComponent,
      nzClassName: 'view-approval-pending',
      nzFooter: null,
    });
    modal.componentInstance!.mode2 = mode;
    modal.componentInstance!.type = type;
  }

  userManagement() {
    this.dataService.userManagementSelectedIndex = 6;
    this.router.navigateByUrl('user-management');
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllVerifyPendingData();
  }
}
