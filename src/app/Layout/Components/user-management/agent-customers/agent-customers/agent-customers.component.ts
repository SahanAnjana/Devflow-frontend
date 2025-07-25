import { Component } from '@angular/core';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import format from 'date-fns/format';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewAgentCustomerTransactionModalComponent } from '../view-agent-customer-transaction-modal/view-agent-customer-transaction-modal.component';
import { AddNotesModalComponent } from '../add-notes-modal/add-notes-modal.component';
import { ViewAgentCustomerComponent } from '../view-agent-customer/view-agent-customer.component';
import { SendMailComponent } from '../send-mail/send-mail.component';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { Subject, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-agent-customers',
  templateUrl: './agent-customers.component.html',
  styleUrls: ['./agent-customers.component.sass'],
})
export class AgentCustomersComponent {
  privileges: any = {
    CORE_SHOW_NEW_CUSTOMERS_MAIL_BUTTON: false,
    CORE_SHOW_EXISTING_CUSTOMERS_STATUS_TOOGLE: false,
    CORE_SHOW_AGENT_CUSTOMER_UNLOCK: false,
    CORE_SHOW_AGENT_CUSTOMER_NOTE: false,
    CORE_SHOW_AGENT_CUSTOMER_VIEW_CORPORATE_ENABLE: false,
    CORE_SHOW_AGENT_CUSTOMER_EDIT: false,
    CORE_SHOW_AGENT_CUSTOMER_STATUS: false,
    CORE_SHOW_AGENT_SENDER_REPORT_VIEW: false,
  };
  // existingAgentCustomers = [];
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;
  totalRecords: any;

  name = '';
  email = '';
  contactNumber = '';
  agentName = '';
  address = '';

  visibleNamePanel: any;
  visibleEmailPanel: any;
  visibleContactPanel: any;
  visibleAgentNamePanel: any;

  filterByNameOn = false;
  filterByEmailOn = false;
  filterByContactOn = false;
  filterByAgentNameOn = false;

  date = new Date();
  currentDate: any;
  statusValue: any;
  clientPaymentModeDto: any;
  isActive: any;
  activatedDate: any;
  deactivatedDate: any;
  searchText: any;
  visibleCustomerReferencePanel: any;
  filterByCustomerReferenceOn = false;
  customerReference = '';
  transactions: any;
  coporateEnable = false;
  lockEnable = false;
  clientData: any;
  privilegeCodes: any;
  noteEnable = false;
  statusEnable = false;
  emailEnable = false;
  emailCoporateEnable = false;
  showEdit = false;
  showAgentCustomerNew = false;
  showAgentCustomerReportView = false;
  defaultData: any;
  searchValue: any;
  private destroy$ = new Subject<void>();
  //temporary services
  privilegeService: any;
  existingAgentCustomers: any[] = [];
  usernamangementPrivilage: any = [];
  public unsubscribe$ = new Subject<void>();
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,

    private dataService: DataService,
    private agentCustomerService: AgentCustomerService,
    private commonsService: CommonsService,
    private notificationService: NzNotificationService,
    private eventTriggerService: EventtriggerService,
    private platformUserService: UserManagementPlatformUserService,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.currentDate = format(this.date, 'yyyy-MM-dd');
    this.getAllExistingAgentCustomers();
    this.getUserPrivilegeDetails();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'agentCustUpdate') {
          this.getAllExistingAgentCustomers();
        }
      },
    });
    this.eventTriggerService.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_NEW_CUSTOMERS_MAIL_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_NEW_CUSTOMERS_MAIL_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_EXISTING_CUSTOMERS_STATUS_TOOGLE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_EXISTING_CUSTOMERS_STATUS_TOOGLE = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_UNLOCK') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_UNLOCK = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_NOTE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_NOTE = true)
          : false;
      }
      if (
        data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_VIEW_CORPORATE_ENABLE'
      ) {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_VIEW_CORPORATE_ENABLE =
              true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_EDIT') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_EDIT = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_STATUS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_STATUS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_AGENT_SENDER_REPORT_VIEW') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_SENDER_REPORT_VIEW = true)
          : false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
  reset(): void {
    this.searchValue = null;
    this.existingAgentCustomers = this.defaultData;
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllExistingAgentCustomers();
  }

  getAllExistingAgentCustomers() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 3;
    data['name'] = this.name;
    data['email'] = this.email;
    data['contactNumber'] = this.contactNumber;
    data['customerReference'] = this.customerReference;
    data['agentName'] = this.agentName;
    data['address'] = this.address;

    this.agentCustomerService
      .getAllAgentCustomerData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.totalRecords = res['responseDto'].totalRecords;
            this.existingAgentCustomers = res['responseDto']['payload'];
            this.defaultData = this.existingAgentCustomers;
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
    this.getAllExistingAgentCustomers();
  }

  resetFilterByName() {
    this.visibleNamePanel = false;
    this.filterByNameOn = false;
    this.name = '';
    this.getAllExistingAgentCustomers();
  }

  filterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = true;
    this.getAllExistingAgentCustomers();
  }

  resetFilterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = false;
    this.email = '';
    this.getAllExistingAgentCustomers();
  }

  filterByContact() {
    this.visibleContactPanel = false;
    this.filterByContactOn = true;
    this.getAllExistingAgentCustomers();
  }

  resetFilterByContact() {
    this.visibleContactPanel = false;
    this.filterByContactOn = false;
    this.contactNumber = '';
    this.getAllExistingAgentCustomers();
  }

  filterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = true;
    this.getAllExistingAgentCustomers();
  }

  resetFilterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = false;
    this.agentName = '';
    this.getAllExistingAgentCustomers();
  }

  filterByAddress() {
    this.getAllExistingAgentCustomers();
  }

  resetFilterByAddress() {
    this.address = '';
    this.getAllExistingAgentCustomers();
  }
  resetFilterByCustomerReference() {
    this.visibleCustomerReferencePanel = false;
    this.filterByCustomerReferenceOn = false;
    this.customerReference = '';
    this.getAllExistingAgentCustomers();
  }

  filterByCustomerReference() {
    this.visibleCustomerReferencePanel = false;
    this.filterByCustomerReferenceOn = true;
    this.getAllExistingAgentCustomers();
  }

  changeStatus(receivedData: any) {
    const data: any = {};
    data['id'] = receivedData.agentSenderDetailsid;
    data['isCoporateEnable'] = !receivedData.enabledCorporateAccount;

    this.agentCustomerService.enableCorporateAccount(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Status updated successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.getAllExistingAgentCustomers();
        } else {
          this.notificationService.create(
            'error',
            res['errorDescription'],
            '',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
          this.getAllExistingAgentCustomers();
        }
      },
    });
    // this.agentCustomerDataService.updateAgentCustomerDetails(data).subscribe(
    //   (res:any) => {
    //     if (res["responseDto"]) {
    //       this.notificationService.createNotification(
    //         "success",
    //         "Status updated successfully",
    //         "#00A03E",
    //         "Success"
    //       );
    //       this.getAllExistingAgentCustomers();
    //     }
    //   },

    // this.notificationService.createNotification(
    //   "error",
    //   "Status update failed",
    //   "#cc2d2d",
    //   "Error"
    // );

    // );
  }

  enableCoporateAccount(receivedData: any) {
    const data: any = {};
    data['agentSenderDetailsId'] = receivedData.agentSenderDetailsId;
    data['isCoporateEnable'] = this.coporateEnable;
    // this.agentCustomerDataService.enableCoporateAccount(data).subscribe(
    //   (res:any) => {
    //     if (res["responseDto"].isCooperateEnable === true) {
    //       this.notificationService.createNotification(
    //         "success",
    //         "Corporate Account enabled successfully",
    //         "#00A03E",
    //         "Success"
    //       );
    //       this.getAllExistingAgentCustomers();
    //     } else if (res["responseDto"].isCooperateEnable === false) {
    //       this.notificationService.createNotification(
    //         "success",
    //         "Corporate Account disabled successfully",
    //         "#00A03E",
    //         "Success"
    //       );
    //       this.getAllExistingAgentCustomers();
    //     } else {
    //       this.notificationService.createNotification(
    //         "error",
    //         "Corporate Account enable failed",
    //         "#cc2d2d",
    //         "Error"
    //       );
    //     }
    //   },
    //   () => {
    //     this.notificationService.createNotification(
    //       "error",
    //       "Corporate Account enable failed",
    //       "#cc2d2d",
    //       "Error"
    //     );
    //   }
    // );
  }

  unlockUser(receivedData: any) {
    console.log(receivedData);
    const data: any = {};
    data['email'] = receivedData.email;
    this.platformUserService
      .unlockUser(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res['errorDescription'],
            {
              nzStyle: { background: '#cc2d2d', color: '#ffffff' },
            }
          );
        }
      });
  }

  viewTransaction(data: any) {
    this.dataService.agentCustomerTransactionData = data;
    this.modalService.create({
      nzTitle: 'Agent Customer Transaction',
      nzContent: ViewAgentCustomerTransactionModalComponent,
      nzFooter: null,
      nzWidth: 1032,
      nzClassName: 'agent-cus-trans',
    });
  }

  getAgentSenderDetailsByUsername(email: any) {
    email &&
      this.agentCustomerService
        .getAgentSenderDetailsByUsername(email)
        .subscribe({
          next: (res: any) => {
            if (res['responseDto']) {
              this.viewCustomerDetails(res['responseDto']);
            }
          },
        });
  }

  viewCustomerDetails(receivedData: any) {
    console.log('rec', receivedData);

    this.dataService.selectedData = receivedData;
    this.dataService.clickEventStatus = 'existingAgentCustomers';
    this.modalService.create({
      nzContent: ViewAgentCustomerComponent,
      nzFooter: null,
      nzWidth: 1012,
      nzClassName: 'view-cus-trans',
    });
  }

  sendEmail(receivedData: any) {
    this.dataService.selectedData = receivedData.email;
    this.dataService.clickEventStatus = 'existingAgentCustomer';
    this.modalService.create({
      nzTitle: 'Send New Email',
      nzContent: SendMailComponent,
      nzFooter: null,
      nzWidth: 720,
      nzClassName: 'send-mail',
    });
  }

  addNotes(receivedData: any) {
    this.dataService.selectedData = receivedData.email;
    this.dataService.agentSenderDetailsId = receivedData.agentSenderDetailsid;
    this.modalService.create({
      nzTitle: 'Add Notes',
      nzContent: AddNotesModalComponent,
      nzFooter: null,
      nzWidth: 720,
      nzClassName: 'agent-cus-trans',
    });
  }

  getUserPrivilegeDetails() {
    // this.clientData = this.commonsService.parseJwt(
    //   localStorage.getItem("currentUser")
    // );
    // const data = this.clientData.sub;
    // this.privilegeService.getUserPrivilegeData().subscribe((res:any) => {
    //   this.privilegeCodes = res["responseDto"];
    //   if (this.privilegeCodes.includes("CORE_SHOW_AGENT_CUSTOMER_UNLOCK")) {
    //     this.lockEnable = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_AGENT_CUSTOMER_NOTE")) {
    //     this.noteEnable = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_AGENT_CUSTOMER_STATUS")) {
    //     this.statusEnable = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_USER_MANAGMENT_EMAIL")) {
    //     this.emailEnable = true;
    //   }
    //   if (
    //     this.privilegeCodes.includes(
    //       "CORE_SHOW_AGENT_CUSTOMER_VIEW_COPORATE_ENABLE"
    //     )
    //   ) {
    //     this.emailCoporateEnable = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_AGENT_CUSTOMER_EDIT")) {
    //     this.showEdit = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_AGENT_CUSTOMER_NEW")) {
    //     this.showAgentCustomerNew = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_AGENT_SENDER_REPORT_VIEW")) {
    //     this.showAgentCustomerReportView = true;
    //   }
    // });
  }

  downloadReport() {
    const data: any = {};
    data['userType'] = this.clientData.client_code;
    data['userName'] = this.clientData.sub;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = 1000000;
    data['searchType'] = 1;

    // this.reportsDataService
    //   .downloadAgentSenderDetailsReport(data)
    //   .subscribe((res:any) => {
    //     if (res) {
    //       console.log(this.clientData);
    //     }
    //   });
  }
  changeStatus2(id: any) {
    const data: any = {};
    data['id'] = 2;
    data['isActive'] = !id.activeStatus;
    data['email'] = id.email;
    this.agentCustomerService.updateStatus2(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Status updated successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.getAllExistingAgentCustomers();
        } else {
          this.notificationService.create(
            'error',
            res['errorDescription'],
            '',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
          this.getAllExistingAgentCustomers();
        }
      },
    });
  }
}
