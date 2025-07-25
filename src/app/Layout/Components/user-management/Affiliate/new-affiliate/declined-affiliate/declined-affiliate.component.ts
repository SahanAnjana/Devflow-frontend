import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { UsermanagementAffliateNewAffliateService } from 'src/app/_services/usermanagement-affliate-new-affliate.service';

@Component({
  selector: 'app-declined-affiliate',
  templateUrl: './declined-affiliate.component.html',
  styleUrls: ['./declined-affiliate.component.sass'],
})
export class DeclinedAffiliateComponent {
  pageNumber = 1;
  pageSize = 20;
  AllData: any;
  totalRecords: any;
  currentPageIndex = 1;

  public unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private usermanagementAffliateNewAffliateService: UsermanagementAffliateNewAffliateService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService
  ) {}

  ngOnInit() {
    this.getAllDeclineData();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'affiliate') {
          this.getAllDeclineData();
        }
      },
    });
  }

  getAllDeclineData() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['searchType'] = 4;
    data['isApproved'] = '';

    this.usermanagementAffliateNewAffliateService
      .declinePndingAllData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.AllData = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
        } else {
          this.AllData = [];
        }
      });
  }

  userManagement() {
    this.router.navigateByUrl('user-management');
    this.dataService.userManagementSelectedIndex = 6;
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllDeclineData();
  }
}
