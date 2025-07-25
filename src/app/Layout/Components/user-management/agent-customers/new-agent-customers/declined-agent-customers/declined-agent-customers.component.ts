import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import format from 'date-fns/format';
import { Location } from '@angular/common';
import { AmlDateUpdateModalComponent } from '../../aml-date-update-modal/aml-date-update-modal.component';
import { ViewAgentCustomerComponent } from '../../view-agent-customer/view-agent-customer.component';
import { SendMailComponent } from '../../send-mail/send-mail.component';
import { Router } from '@angular/router';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-declined-agent-customers',
  templateUrl: './declined-agent-customers.component.html',
  styleUrls: ['./declined-agent-customers.component.sass'],
})
export class DeclinedAgentCustomersComponent {
  privileges: any = {
    CORE_SHOW_NEW_CUSTOMERS_UPDATE_AML_BUTTON: false,
  };
  declinedCustomers: any[] = [];
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

  clientData: any;
  existingAgentCustomers: any[] = [];
  allPrivilages: any;
  constructor(
    private modalService: NzModalService,
    private location: Location,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private commonsService: CommonsService,
    private agentCustomerService: AgentCustomerService,
    private router: Router, // private agentCustomerDataService: AgentCustomerDataService, // private eventTriggerService: EventTriggerService
    private eventTriggerService: EventtriggerService,
    private tokenService: TokenserviceService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.getAllDeclinedCustomers();

    // this.eventTriggerService.executeOnchangeFunction.subscribe(() => {
    //   this.getAllDeclinedCustomers();
    // });

    this.currentDate = format(this.date, 'yyyy-MM-dd');
    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
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
    this.getAllDeclinedCustomers();
  }

  getAllDeclinedCustomers() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['name'] = this.name;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['agentName'] = this.agentName;

    this.agentCustomerService
      .getAllAgentSenderDeclineUsers(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.totalRecords = res['responseDto'].totalRecords;
          this.declinedCustomers = res['responseDto']['payload'];
        } else {
          this.declinedCustomers = [];
          this.totalRecords = 0;
        }
      });
  }

  filterByName() {
    this.visibleNamePanel = false;
    this.filterByNameOn = true;
    this.getAllDeclinedCustomers();
  }

  resetFilterByName() {
    this.visibleNamePanel = false;
    this.filterByNameOn = false;
    this.name = '';
    this.getAllDeclinedCustomers();
  }

  filterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = true;
    this.getAllDeclinedCustomers();
  }

  resetFilterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = false;
    this.email = '';
    this.getAllDeclinedCustomers();
  }

  filterByContact() {
    this.visibleContactPanel = false;
    this.filterByContactOn = true;
    this.getAllDeclinedCustomers();
  }

  resetFilterByContact() {
    this.visibleContactPanel = false;
    this.filterByContactOn = false;
    this.contactNumber = '';
    this.getAllDeclinedCustomers();
  }

  filterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = true;
    this.getAllDeclinedCustomers();
  }

  resetFilterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = false;
    this.agentName = '';
    this.getAllDeclinedCustomers();
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
        this.getAllDeclinedCustomers();
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

  viewExistingCustomers() {
    this.dataService.selectedIndex = 3;
    this.location.back();
  }

  updateAMLChecked(receivedData: any) {
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
      this.getAllDeclinedCustomers();
    });
  }

  viewCustomerDetails(receivedData: any) {
    this.dataService.selectedData = receivedData;
    this.dataService.clickEventStatus = 'declinedAgentCustomers';
    const modal = this.modalService.create({
      nzContent: ViewAgentCustomerComponent,
      nzFooter: null,
      nzWidth: 1012,
      nzClassName: 'view-cus-trans',
    });
    modal.afterClose.subscribe((res) => {
      this.getAllDeclinedCustomers();
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
  getAgentSenderDetailsByUsername(email: any) {
    this.agentCustomerService.getAgentSenderDetailsByUsername(email).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.viewCustomerDetails(res['responseDto']);
        }
      },
    });
  }
}
