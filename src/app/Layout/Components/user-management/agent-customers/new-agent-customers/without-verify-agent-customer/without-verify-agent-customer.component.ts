import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';

@Component({
  selector: 'app-without-verify-agent-customer',
  templateUrl: './without-verify-agent-customer.component.html',
  styleUrls: ['./without-verify-agent-customer.component.sass'],
})
export class WithoutVerifyAgentCustomerComponent {
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;
  totalRecords: any;
  pendingCustomers: any[] = [];

  name = '';
  email = '';

  visibleNamePanel: any;
  visibleEmailPanel: any;
  filterByNameOn = false;
  filterByEmailOn = false;
  constructor(
    private agentCustomerDataService: AgentCustomerService,
    private notificationService: NzNotificationService,
    private location: Location,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
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

  filterByName() {
    this.visibleNamePanel = false;
    this.filterByNameOn = true;
    this.getAllPendingCustomers();
  }

  resetFilterByEmail() {
    this.visibleEmailPanel = false;
    this.filterByEmailOn = false;
    this.email = '';
    this.getAllPendingCustomers();
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllPendingCustomers();
  }
  userManagement() {
    this.dataService.userManagementSelectedIndex = 3;
    this.router.navigateByUrl('/user-management');
  }

  getAllPendingCustomers() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['name'] = this.name;
    data['email'] = this.email;

    this.agentCustomerDataService
      .getAllAgentSenderPendingUsers(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.totalRecords = res['responseDto'].totalRecords;
          this.pendingCustomers = res['responseDto']['payload'];
        } else {
          this.pendingCustomers = [];
          this.totalRecords = 0;
        }
      });
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
  viewExistingCustomers() {
    this.dataService.selectedIndex = 3;
    this.location.back();
  }
}
