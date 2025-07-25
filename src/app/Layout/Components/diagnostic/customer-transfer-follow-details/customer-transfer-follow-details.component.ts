import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewComponent } from '.././view/view/view.component';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customer-transfer-follow-details',
  templateUrl: './customer-transfer-follow-details.component.html',
  styleUrls: ['./customer-transfer-follow-details.component.sass'],
})
export class CustomerTransferFollowDetailsComponent {
  pageNumber = 1;
  pageSize = 20;
  selectedAgentName: any;
  selectedCustomerRefferences: any;

  agentName: any;
  customerReference: any;

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

  onSwitchChange(event: boolean): void {}

  getTransferFlowDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['agentName'] = this.selectedAgentName;
    data['customerReference'] = this.selectedCustomerRefferences;
    this.diagnosticService
      .getdiagnosticTransferFlowDetails(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.customerTransferFlowDetaisTable = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];

          // this.isSuccess = res['payload']['isSuccess'];
        }
      });
  }

  flterAgentName() {
    this.selectedAgentName = this.agentName;
    this.getTransferFlowDetails();
  }

  flteCustomerReference() {
    this.selectedCustomerRefferences = this.customerReference;
    this.getTransferFlowDetails();
  }

  reset() {
    this.selectedAgentName = null;
    this.agentName = null;
    this.selectedCustomerRefferences = null;
    this.customerReference = null;
    this.getTransferFlowDetails();
  }
  pageIndexChange(selectValue: any) {
    this.currentPageIndex = selectValue;
    this.pageNumber = selectValue;
    this.getTransferFlowDetails();
  }
  view(mode: any) {
    const modal = this.modalService.create({
      nzContent: ViewComponent,
      nzClassName: 'view',
      nzWidth: 1012,
      nzFooter: null,
    });

    modal.componentInstance!.mode = mode;
  }
}
