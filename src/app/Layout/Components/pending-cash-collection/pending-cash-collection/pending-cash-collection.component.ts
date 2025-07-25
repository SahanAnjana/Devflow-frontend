import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { PendingcashService } from 'src/app/_services/pendingcash.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { differenceInCalendarDays, format } from 'date-fns';
@Component({
  selector: 'app-pending-cash-collection',
  templateUrl: './pending-cash-collection.component.html',
  styleUrls: ['./pending-cash-collection.component.sass'],
})
export class PendingCashCollectionComponent {
  switchValue = false;
  userValue: any;
  currentUser: any;
  //currentpage = 1;
  pageNumber = 1;
  pageSize = 10;
  destroy$: Subject<boolean> = new Subject<boolean>();
  pendingcashDetails: any;
  totalRecords: any;
  currentPageIndex = 1;
  startDate: any;
  endDate: any;
  startAmount: any;
  endAmount: any;
  agentName: any;

  FeeTypes = [
    {
      feetypeId: 1,
      name: 'qa_Spoton Money',
    },
  ];

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private pendingCashService: PendingcashService
  ) {}

  ngOnInit() {
    this.getAllPendingCashDetails();

    this.userValue = this.commonService.parseJwt(this.tokenService.getToken());
    this.currentUser = this.commonService.parseJwt(
      this.tokenService.getToken()
    );
  }

  getAllPendingCashDetails() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['startAmount'] = this.startAmount;
    data['endAmount'] = this.endAmount;
    data['fromDate'] = this.startDate
      ? format(this.startDate, 'yyyy-MM-dd')
      : '';
    data['toDate'] = this.endDate ? format(this.endDate, 'yyyy-MM-dd') : '';
    data['agentName'] = this.agentName;

    this.pendingCashService
      .getAllPendingCashData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.pendingcashDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.pendingcashDetails = [];
          }
        },
      });
  }

  resetDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.getAllPendingCashDetails();
  }

  resetTotalPaybaleFilter() {
    this.startAmount = null;
    this.endAmount = null;
    this.getAllPendingCashDetails();
  }

  resetagentNameFilter() {
    this.agentName = null;
    this.getAllPendingCashDetails();
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllPendingCashDetails();
  }
  todayDate = new Date();
  disabledFutureDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };
}
