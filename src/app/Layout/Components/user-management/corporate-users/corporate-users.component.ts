import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewCoporateUsersComponent } from '../new-coporate-users/new-coporate-users.component';
import { Router } from '@angular/router';
import { CorporateCustomerdocumentsComponent } from '../corporate-customerdocuments/corporate-customerdocuments.component';
import { SendEmailComponent } from '../platform-users/send-email/send-email.component';
import { AddNotesModalComponent } from '../agent-customers/add-notes-modal/add-notes-modal.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { Subject, takeUntil } from 'rxjs';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { AmlDateUpdateModalComponent } from '../agent-customers/aml-date-update-modal/aml-date-update-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DocumentationComponent } from '../new-coporate-users/documentation/documentation.component';
import { CoporateUsersViewComponent } from '../coporate-users-view/coporate-users-view.component';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
@Component({
  selector: 'app-corporate-users',
  templateUrl: './corporate-users.component.html',
  styleUrls: ['./corporate-users.component.sass'],
})
export class CorporateUsersComponent {
  privileges: any = {
    CORE_SHOW_AGENT_CUSTOMER_VIEW_COPORATE_ENABLE: false,
  };
  switchValue = false;
  pageNumber = 1;
  pageSize = 10;
  destroy$: Subject<boolean> = new Subject<boolean>();
  corporateUserDetails: any;
  totalRecords: any;

  name: any;
  email: any;
  contactNumber: any;
  agentName: any;
  address: any;
  customerRef: any;
  ownerName: any;
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private corporateService: CoperateuserService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private eventTriggerService: EventTriggerService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.getAllCorporateUser();
    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (
        data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_VIEW_COPORATE_ENABLE'
      ) {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_VIEW_COPORATE_ENABLE =
              true)
          : false;
      }
    });
  }

  viewnewcorporate() {
    this.router.navigateByUrl('/user-management/coporate-user');
  }
  sendEmail(email: any) {
    const modal = this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: SendEmailComponent,
      nzClassName: 'view-send-email',
      nzFooter: null,
    });
    modal.componentInstance!.getEmail = email;
  }

  addNotes(userCoorperateId: any) {
    console.log(userCoorperateId);
    this.dataService.existingAgentCorporateDetails =
      userCoorperateId.agentUserCooperateId;
    const modal = this.modalService.create({
      nzContent: CoporateUsersViewComponent,
      nzWidth: 806,
      nzFooter: null,
      nzClassName: 'documentation',
    });
    modal.componentInstance!.coorporateId =
      userCoorperateId.agentUserCooperateId;
    modal.componentInstance!.mode = userCoorperateId;
  }

  currentpage = 1;

  getAllCorporateUser() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 3;
    data['name'] = this.name;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['agentName'] = this.agentName;
    data['address'] = this.address;
    data['customerRef'] = this.customerRef;
    data['ownerName'] = this.ownerName;

    this.corporateService
      .getAllCorporateUser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.corporateUserDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.corporateUserDetails = [];
          }
        },
      });
  }

  reset() {
    this.name = '';
    this.email = '';
    this.contactNumber = '';
    this.agentName = '';
    this.address = '';
    this.customerRef = '';
    this.ownerName = '';
    this.getAllCorporateUser();
  }

  changeStatus(receivedData: any) {
    const data: any = {};

    data['isMail'] = true;
    data['email'] = receivedData.email;
    data['isActive'] = !receivedData.isActive;

    this.corporateService.updateStatus(data).subscribe({
      next: (res) => {
        if (res['responseDto'] != null) {
          this.createNotifications(
            'success',
            'Updated Successfully',
            '#F45300',
            'Success'
          );
        } else {
          this.createNotifications(
            'Error',
            res['errorDescription'],
            '#F45300',
            'Error'
          );
        }
      },
    });
  }

  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    // console.log('createNotification');
    // title: string, message: string
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }

  pageIndexChange(selectValue: any) {
    this.currentpage = selectValue;
    this.pageNumber = selectValue;
    this.getAllCorporateUser();
  }
}
