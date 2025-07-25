import { Component } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddNewTransferLimitComponent } from '../add-new-transfer-limit/add-new-transfer-limit.component';
import { UpdateNewTransferLimitComponent } from '../update-new-transfer-limit/update-new-transfer-limit.component';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TransferLimitService } from 'src/app/_services/transfer-limit.service';
import { AgentService } from 'src/app/_services/agent.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { ReportService } from 'src/app/_services/report.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';

@Component({
  selector: 'app-transfer-limit',
  templateUrl: './transfer-limit.component.html',
  styleUrls: ['./transfer-limit.component.sass'],
})
export class TransferLimitComponent {
  privileges: any = {
    CORE_SHOW_TRANSFER_LIMIT_ADD_TRANSFER_LIMIT: false,
  };
  pageNumber: any = 1;
  pageSize: any = 10;
  transferlimitdetails: any[] = [];
  totalRecord: any;
  currentPageIndex = 1;
  durations: any;
  exposeId: any;

  //pageNumber=1;
  //pageSize=50;
  exposableId: any;
  public unsubscribe$ = new Subject<void>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  TransferLimitDetails: any;
  currentUser: any;
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,
    private dataService: DataService,
    private transferlimit: TransferLimitService,
    private agentService: AgentService,
    private commonservice: CommonsService,
    private tokenService: TokenserviceService,
    private transferLimitService: TransferLimitService,
    private report: ReportService,
    private eventTriggerService: EventTriggerService
  ) {
    this.currentUser = this.commonservice.parseJwt(
      this.tokenService.getToken()
    );
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit(): void {
    this.getExposableId();
    console.log(this.dataService.exposableIdMonex);
    this.gettransferlimitdetails();

    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_TRANSFER_LIMIT_ADD_TRANSFER_LIMIT') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_TRANSFER_LIMIT_ADD_TRANSFER_LIMIT = true)
          : false;
      }
    });
  }
  getExposableId() {
    const data: any = {};
    data['username'] = this.currentUser.sub;
    this.report
      .getAgentDetailsGetExposableId(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.exposableId = res['responseDto']['data'];
          this.gettransferlimitdetails();
        },
      });
  }
  gettransferlimitdetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['exposableId'] = 'JVb3mfaNS29';
    this.transferlimit.getdetailstransferlimit(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.transferlimitdetails = res['responseDto']['payload'];
          this.totalRecord = res['responseDto']['totalRecords'];
          // this.transferlimitdetails = this.dataService.value;
          this.dataService.value = this.transferlimitdetails;
        }
      },

      error: (err) => {},
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.gettransferlimitdetails();
  }

  getdurationtype() {
    this.transferlimit.getduration().subscribe((res: any) => {
      if (res['responseDto']) {
        this.durations = res['responseDto'];
        console.log(this.durations);
        const result = this.durations.find(
          (item: { duration: string }) =>
            item.duration === this.dataService.transferData.duration
        );
        console.log('result', result);
        this.dataService.durationID = result.limitDurationId;
        console.log('..', this.dataService.durationID);
      }
    });
  }

  updateNewTransferLimit(receivedData: any) {
    this.dataService.transferData = receivedData;
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Update  New Transfer Limit',
      nzContent: UpdateNewTransferLimitComponent,
      nzClassName: 'update-new-transfer',
      nzWidth: 688,
      nzFooter: null,
    });
    modal.afterClose.subscribe({
      next: () => {
        this.gettransferlimitdetails();
      },
    });
  }
  getAllTransferLimitDetails() {
    const data: any = {};
    data['exposableId'] = this.dataService.exposableId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    this.transferLimitService
      .getdetailstransferlimit(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.TransferLimitDetails = res['responseDto']['payload'];
          }
        },
      });
  }

  addNewTransferLimit() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Add New Transfer Limit',
      nzContent: AddNewTransferLimitComponent,
      nzClassName: 'add-new-role',
      nzWidth: 688,
      nzFooter: null,
    });
    modal.afterClose.subscribe({
      next: () => {
        this.gettransferlimitdetails();
      },
    });
  }
}
