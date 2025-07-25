import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { Location } from '@angular/common';
import format from 'date-fns/format';
import { AmlDateUpdateModalComponent } from '../../aml-date-update-modal/aml-date-update-modal.component';
import { SendMailComponent } from '../../send-mail/send-mail.component';
import { ViewAgentCustomerComponent } from '../../view-agent-customer/view-agent-customer.component';
import { Router } from '@angular/router';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { Subject, takeUntil } from 'rxjs';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-approval-pending-agent-customers',
  templateUrl: './approval-pending-agent-customers.component.html',
  styleUrls: ['./approval-pending-agent-customers.component.sass'],
})
export class ApprovalPendingAgentCustomersComponent {
  privileges: any = {
    CORE_SHOW_NEW_CUSTOMERS_ACCEPT_BUTTON: false,
    CORE_SHOW_NEW_CUSTOMERS_DECLINE_BUTTON: false,
    CORE_SHOW_NEW_CUSTOMERS_UPDATE_AML_BUTTON: false,
  };
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;
  totalRecords: any;

  name = '';
  email = '';
  contactNumber = '';
  agentName = '';

  visibleNamePanel: any;
  visibleEmailPanel: any;
  visibleContactPanel: any;
  visibleAgentNamePanel: any;

  filterByNameOn = false;
  filterByEmailOn = false;
  filterByContactOn = false;
  filterByAgentNameOn = false;

  customerReference = '';

  clientPaymentModeDto: any;
  date = new Date();
  currentDate: any;
  searchText: any;
  existingAgentCustomers: any[] = [];
  clientData: any;
  usernamangementPrivilage: any = [];
  private destroy$ = new Subject<void>();
  allPrivilages: any;
  constructor(
    private modalService: NzModalService,
    private location: Location,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private commonsService: CommonsService,
    private router: Router,
    private eventTriggerService: EventTriggerService,
    private agentCustomerService: AgentCustomerService, // private agentCustomerDataService: AgentCustomerDataService, // private eventTriggerService: EventTriggerService
    private tokenService: TokenserviceService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.getAllPendingCustomers();
    this.eventTriggerService.executeOnchangeFunction.subscribe((res) => {
      if (res === 'signup') {
        this.getAllPendingCustomers();
      }
    });
    this.currentDate = format(this.date, 'yyyy-MM-dd');
    this.eventTriggerService.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_NEW_CUSTOMERS_ACCEPT_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_NEW_CUSTOMERS_ACCEPT_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_NEW_CUSTOMERS_DECLINE_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_NEW_CUSTOMERS_DECLINE_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_NEW_CUSTOMERS_UPDATE_AML_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_NEW_CUSTOMERS_UPDATE_AML_BUTTON = true)
          : false;
      }
    });
  }

  userManagement() {
    this.dataService.userManagementSelectedIndex = 3;
    this.router.navigateByUrl('/user-management');
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllPendingCustomers();
  }

  getAllPendingCustomers() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 2;
    data['name'] = this.name;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['customerReference'] = this.customerReference;
    data['agentName'] = this.agentName;

    this.agentCustomerService
      .getAllAgentCustomerData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.totalRecords = res['responseDto'].totalRecords;
            this.existingAgentCustomers = res['responseDto']['payload'];
          } else {
            this.totalRecords = 0;
            this.existingAgentCustomers = [];
          }
        },
      });
  }

  filterByName() {
    this.visibleNamePanel = false;
    this.filterByNameOn = true;
    this.getAllPendingCustomers();
  }

  resetFilterByName() {
    this.visibleNamePanel = false;
    this.filterByNameOn = false;
    this.name = '';
    this.getAllPendingCustomers();
  }

  filterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = true;
    this.getAllPendingCustomers();
  }

  resetFilterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = false;
    this.email = '';
    this.getAllPendingCustomers();
  }

  filterByContact() {
    this.visibleContactPanel = false;
    this.filterByContactOn = true;
    this.getAllPendingCustomers();
  }

  resetFilterByContact() {
    this.visibleContactPanel = false;
    this.filterByContactOn = false;
    this.contactNumber = '';
    this.getAllPendingCustomers();
  }

  filterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = true;
    this.getAllPendingCustomers();
  }

  resetFilterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = false;
    this.agentName = '';
    this.getAllPendingCustomers();
  }

  accept(receivedData: any) {
    const data: any = {};
    data['requestType'] = 1;
    data['email'] = receivedData.email;
    data['isApprove'] = true;
    data['isActive'] = true;

    this.agentCustomerService.updateStatus(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.notificationService.create(
          'success',
          'Success',
          'Request approved successfully',
          { nzStyle: { background: '#00A03E' } }
        );
        this.getAllPendingCustomers();
      } else {
        this.notificationService.create(
          'error',
          'Failed',
          res['errorDescription'],
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      }
    });
  }

  decline(receivedData: any) {
    const data: any = {};
    data['requestType'] = 1;
    data['email'] = receivedData.email;
    data['isApprove'] = false;
    data['isActive'] = false;

    this.agentCustomerService.updateStatus(data).subscribe(
      (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Request declined successfully',
            { nzStyle: { background: '#00A03E' } }
          );
          this.getAllPendingCustomers();
        } else {
          this.notificationService.create(
            'error',
            'Failed',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );

          this.getAllPendingCustomers();
        }
      },
      () => {
        this.notificationService.create(
          'error',
          'Error',
          'Request decline failed',
          { nzStyle: { background: '#cc2d2d' } }
        );
      }
    );
  }

  viewExistingCustomers() {
    this.dataService.selectedIndex = 3;
    this.location.back();
  }

  updateAMLChecked(receivedData: any) {
    console.log('data', receivedData);
    this.dataService.selectedData = receivedData;
    this.dataService.clickEventStatus = 'fromAgentCustomer';
    const modal = this.modalService.create({
      nzTitle: 'Update AML details',
      nzContent: AmlDateUpdateModalComponent,
      nzWidth: 530,
      nzFooter: null,
      nzClassName: 'aml-update',
    });
    modal.afterClose.subscribe((res) => {
      this.getAllPendingCustomers();
    });
  }

  viewCustomerDetails(receivedData: any) {
    this.dataService.selectedData = receivedData;
    this.dataService.clickEventStatus = 'newAgentCustomers';
    const modal = this.modalService.create({
      nzContent: ViewAgentCustomerComponent,
      nzFooter: null,
      nzWidth: 1012,
      nzClassName: 'view-cus-trans',
    });
    modal.afterClose.subscribe((res) => {
      this.getAllPendingCustomers();
    });
  }
  getAgentSenderDetailsByUsername(email: any) {
    this.agentCustomerService.getAgentSenderDetailsByUsername(email).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.viewCustomerDetails(res['responseDto']);
        }
      },
    });
  }

  sendEmail(receivedData: any) {
    this.dataService.selectedData = receivedData.email;
    this.dataService.clickEventStatus = 'newAgentCustomerRegistration';
    this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: SendMailComponent,
      nzWidth: 560,
      nzFooter: null,
      nzClassName: 'send-mail',
    });
  }

  addAgentCustomer() {
    // this.modalService.createComponentModal(SignupModalComponent, 'Sign Up', 'Sign Up', '');
  }
}
