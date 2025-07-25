import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';

@Component({
  selector: 'app-customer-follow-details',
  templateUrl: './customer-follow-details.component.html',
  styleUrls: ['./customer-follow-details.component.sass'],
})
export class CustomerFollowDetailsComponent {
  pageNumber = 1;
  pageSize = 20;
  selectedName: any;
  selectedEmail: any;
  selectedContactNum: any;
  selectedAgentName: any;
  selectedAddress: any;

  name: any;
  email: any;
  telephoneNo: any;
  agentName: any;
  address: any;

  customerTransferFlowDetaisTable: any;
  totalRecords: any;

  public unsubscribe$ = new Subject<void>();
  currentPageIndex = 1;
  constructor(
    private diagnosticService: DiagnosticService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.getTransferFlowDetails();
  }

  getTransferFlowDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['name'] = this.selectedName;
    data['email'] = this.selectedEmail;
    data['telephoneNo'] = this.selectedContactNum;
    data['agentName'] = this.selectedAgentName;
    data['address'] = this.selectedAddress;
    this.diagnosticService
      .getcuastomerTransferFlowDetails(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.customerTransferFlowDetaisTable = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
          // this.pageSize = res['responseDto']['pageSize'];
          // this.pageNumber = res['responseDto']['pageNumber'];

          // this.isSuccess = res['payload']['isSuccess'];
        }
      });
  }

  flterName(select: any) {
    this.selectedName = this.name;
    this.getTransferFlowDetails();
  }

  flterEmail() {
    this.selectedEmail = this.email;
    this.getTransferFlowDetails();
  }

  flterContactNumber() {
    this.selectedContactNum = this.telephoneNo;
    this.getTransferFlowDetails();
  }
  flterAgentName() {
    this.selectedAgentName = this.agentName;
    this.getTransferFlowDetails();
  }

  flterAddress() {
    this.selectedAddress = this.address;
    this.getTransferFlowDetails();
  }

  reset() {
    this.name = null;
    this.selectedName = null;
    this.selectedEmail = null;
    this.email = null;
    this.selectedContactNum = null;
    this.telephoneNo = null;
    this.selectedAgentName = null;
    this.agentName = null;
    this.selectedAddress = null;
    this.address = null;
    this.getTransferFlowDetails();
  }
  pageIndexChange(selectValue: any) {
    this.currentPageIndex = selectValue;
    this.pageNumber = selectValue;
    this.getTransferFlowDetails();
  }
  // flterSection(select: any) {
  //   this.selectedUserName = this.username;
  //   this.getLoginDetails();
  // }

  // reset() {
  //   this.username = null;
  //   this.selectedUserName = null;
  //   this.getLoginDetails();
  // }

  onSwitchChange(event: boolean): void {}
}
