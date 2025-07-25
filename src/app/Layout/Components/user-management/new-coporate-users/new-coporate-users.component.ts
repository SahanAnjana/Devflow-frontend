import { Component } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NewCorporateMainComponent } from './new-corporate-main/new-corporate-main.component';
import { CorporateUsersComponent } from '../corporate-users/corporate-users.component';
import { Router } from '@angular/router';
import { SendEmailComponent } from '../platform-users/send-email/send-email.component';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { AmlDateUpdateModalComponent } from '../agent-customers/aml-date-update-modal/aml-date-update-modal.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
@Component({
  selector: 'app-new-coporate-users',
  templateUrl: './new-coporate-users.component.html',
  styleUrls: ['./new-coporate-users.component.sass'],
})
export class NewCoporateUsersComponent {
  switchValue = false;
  pageNumber = 1;
  pageSize = 10;
  newCorporateUserDetails: any;
  totalRecords: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  //currentPageIndex:any

  name: any;
  email: any;
  contactNumber: any;
  agentName: any;
  currentPageIndex = 1;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private corporateService: CoperateuserService,
    private notificationService: NzNotificationService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllNewCorporateUser();
  }

  viewcorporatecustomer(type: any, mode: any) {
    const model = this.modalService.create({
      // nzTitle: "View Agent Privillage Settings",
      nzContent: NewCorporateMainComponent,
      nzClassName: 'documentation',
      nzWidth: 806,
      nzFooter: null,
    });
    model.componentInstance!.type = type;
    model.componentInstance!.mode = mode;
    this.dataService.agentCorporateDetails = mode;
  }
  exitcorporate() {
    this.router.navigateByUrl('user-management/coporate-user');
  }

  userManagement() {
    this.dataService.userManagementSelectedIndex = 4;
    this.router.navigateByUrl('user-management');
  }

  sendEmail(type: any, mode: any) {
    const model = this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: SendEmailComponent,
      nzClassName: 'view-send-email',
      nzFooter: null,
    });
    model.componentInstance!.type = type;
    model.componentInstance!.mode = mode;
  }

  getAllNewCorporateUser() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 2;
    data['name'] = this.name;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['agentName'] = this.agentName;

    this.corporateService
      .getAllNewCorporateUser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.newCorporateUserDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.newCorporateUserDetails = [];
          }
        },
      });
  }

  reset() {
    (this.name = ''),
      (this.email = ''),
      (this.contactNumber = ''),
      (this.agentName = '');

    this.getAllNewCorporateUser();
  }

  pageIndexChange(selectValue: any) {
    this.currentPageIndex = selectValue;
    this.pageNumber = selectValue;
    this.getAllNewCorporateUser();
  }

  updateAml(data: any) {
    this.dataService.clickEventStatus = 'fromCoporateUsers';
    const model = this.modalService.create({
      nzTitle: 'Update AML details',
      nzContent: AmlDateUpdateModalComponent,
      nzWidth: 530,
      nzFooter: null,
      nzClassName: 'aml-update',
    });
    model.afterClose.subscribe({
      next: () => {
        this.getAllNewCorporateUser();
      },
    });
    // model.componentInstance!.type = type;
    model.componentInstance!.mode = data;
  }

  declineStatus(value: any) {
    const data: any = {};

    data['requestType'] = 1;
    data['email'] = value;
    data['isApprove'] = false;

    this.corporateService
      .updateCorporateStaus(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            const msg = res['responseDto'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffff' },
            });
            this.getAllNewCorporateUser();
          } else {
            this.notificationService.create('error', 'Error', 'update failed', {
              nzStyle: { background: '#cc2d2d', color: '#ffff' },
            });
          }
        },
      });
  }

  accepet(value: any) {
    const data: any = {};

    data['requestType'] = 1;
    data['email'] = value;
    data['isApprove'] = true;
    data['isMail'] = true;

    this.corporateService
      .updateCorporateStaus(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            const msg = res['responseDto'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffff' },
            });

            this.getAllNewCorporateUser();
          } else {
            this.notificationService.create('error', 'Error', res['errorDescription'], {
              nzStyle: { background: '#cc2d2d', color: '#ffff' },
            });
          }
        },
      });
  }

  close() {
    this.getAllNewCorporateUser();
  }
}
