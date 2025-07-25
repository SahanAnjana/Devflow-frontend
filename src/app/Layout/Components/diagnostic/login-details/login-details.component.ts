import { Component, ViewChild } from '@angular/core';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';

@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.sass'],
})
export class LoginDetailsComponent {
  isDisabled = false;

  loginDetaisTable: any;

  pageNumber = 1;
  pageSize = 20;
  totalRecords: any;
  currentPageIndex = 1;
  isSuccess!: false;
  switchValue!: boolean;
  username: any;
  selectedUserName: any;

  public unsubscribe$ = new Subject<void>();

  constructor(private diagnosticService: DiagnosticService) {}

  ngOnInit(): void {
    this.getLoginDetails();
  }

  getLoginDetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['username'] = this.selectedUserName;

    this.diagnosticService
      .getdiagnosticLoginDetails(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['payload']) {
          this.loginDetaisTable = res['payload'];
          this.totalRecords = res['totalRecords'];
          // this.pageSize = res['pageSize'];
          // this.pageNumber = res['pageNumber'];

          // this.isSuccess = res['payload']['isSuccess'];
        }
      });
  }

  flterSection(select: any) {
    this.selectedUserName = this.username;
    this.getLoginDetails();
  }

  reset() {
    this.username = null;
    this.selectedUserName = null;
    this.getLoginDetails();
  }

  pageIndexChange(selectValue: any) {
    this.currentPageIndex = selectValue;
    this.pageNumber = selectValue;
    this.getLoginDetails();
  }

  onSwitchChange(event: boolean): void {}
}
