import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewDualRegistrationDetailsComponent } from '../view/view-dual-registration-details/view-dual-registration-details.component';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';
import { Subject, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-customer-dual-registration',
  templateUrl: './customer-dual-registration.component.html',
  styleUrls: ['./customer-dual-registration.component.sass'],
})
export class CustomerDualRegistrationComponent {
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;
  dualRegistrationData: any;
  totalRecords: any;

  public unsubscribe$ = new Subject<void>();

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private diagnosticService: DiagnosticService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getDualRegistrationData();
  }

  getDualRegistrationData() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.diagnosticService
      .getdualRegistrationData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.dualRegistrationData = res['responseDto']['payload'];
          this.totalRecords = res['responseDto']['totalRecords'];
          // this.pageSize = res['responseDto']['pageSize'];
          // this.pageNumber = res['responseDto']['pageNumber'];
          // console.log('total records', res['responseDto']['totalRecords']);
        }
      });
  }

  deleteDataRow(value: any) {
    // console.log('dual id', value);
    const data: any = {};
    data['dualRegistrationId'] = value;

    this.diagnosticService
      .deleteData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto']['message'];
          this.notification.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
          this.getDualRegistrationData();
        }
      });
  }

  onSwitchChange(event: boolean): void {}

  view(mode: any) {
    const modal = this.modalService.create({
      nzContent: ViewDualRegistrationDetailsComponent,
      nzTitle: 'View Dual Registration Details',
      nzClassName: 'view-dual',
      nzWidth: 1012,
      nzFooter: null,
    });
    modal.componentInstance!.mode = mode;
  }

  pageIndexChange(selectValue: any) {
    this.currentPageIndex = selectValue;
    this.pageNumber = selectValue;
    this.getDualRegistrationData();
  }
}
