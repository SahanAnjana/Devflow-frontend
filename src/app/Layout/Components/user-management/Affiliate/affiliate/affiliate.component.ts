import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AffiliateSettingsModalComponent } from '../affiliate-settings-modal/affiliate-settings-modal.component';
import { Router } from '@angular/router';
import { UserManagementAffliateService } from 'src/app/_services/user-management-affliate.service';
import { Subject, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.sass'],
})
export class AffiliateComponent {
  switchValue = false;

  allAffliateUsers: any;
  totalRecords: any;
  pageNumber = 1;
  pageSize = 20;

  name: any;
  selectedname: any;
  agentName: any;
  selectedagentName: any;
  email: any;
  selectedEmail: any;
  agentAddress: any;
  selectAgentAddress: any;

  currentPageIndex = 1;

  public unsubscribe$ = new Subject<void>();

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private userManagementAffliateService: UserManagementAffliateService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit() {
    this.getAllExistingUsers();
  }

  getAllExistingUsers() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['isApproved'] = true;
    data['name'] = this.selectedname;
    data['agentName'] = this.selectedagentName;
    data['email'] = this.selectedEmail;
    data['agentAddress'] = this.selectAgentAddress;
    data['searchType'] = 1;
    this.userManagementAffliateService
      .getExcitingAffliateUsers(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.allAffliateUsers = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
          this.pageSize = res['responseDto']['pageSize'];
        }
      });
  }

  filterByname() {
    if (this.name) {
      this.selectedname = this.name;
    } else {
      this.selectedname = '';
    }

    this.getAllExistingUsers();
  }

  filterByAgentName() {
    if (this.agentName) {
      this.selectedagentName = this.agentName;
    } else {
      this.selectedagentName = '';
    }

    this.getAllExistingUsers();
  }

  filterByEmail() {
    if (this.email) {
      this.selectedEmail = this.email;
    } else {
      this.selectedEmail = '';
    }
    this.getAllExistingUsers();
  }

  filterByAddress() {
    if (this.agentAddress) {
      this.selectAgentAddress = this.agentAddress;
    } else {
      this.selectAgentAddress = '';
    }
    this.getAllExistingUsers();
  }

  resetFilter() {
    this.selectedname = '';
    this.name = '';
    this.selectedagentName = '';
    this.agentName = '';
    this.selectedEmail = '';
    this.email = '';
    this.selectAgentAddress = '';
    this.agentAddress = '';
    this.getAllExistingUsers();
  }

  viewNewAffiliate(mode: any) {
    const modal = this.modalService.create({
      nzTitle: 'Privillage Settings',
      nzContent: AffiliateSettingsModalComponent,
      nzClassName: 'view-affiliate-modal',
      nzFooter: null,
    });
    modal.componentInstance!.mode = mode;
  }

  updateStatus(value: any) {
    const data: any = {};
    data['agntDetailsId'] = value.agentDetailsId;
    data['status'] = !value.status;
    this.userManagementAffliateService
      .updateUserStatus(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto']['message'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }

  viewNewAfflicate() {
    console.log('route working');
    this.router.navigateByUrl('user-management/view-new-affliate');
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllExistingUsers();
  }
}
