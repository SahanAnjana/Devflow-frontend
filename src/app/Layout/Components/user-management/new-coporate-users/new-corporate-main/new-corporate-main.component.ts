import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';

@Component({
  selector: 'app-new-corporate-main',
  templateUrl: './new-corporate-main.component.html',
  styleUrls: ['./new-corporate-main.component.sass'],
})
export class NewCorporateMainComponent {
  @Input() mode: any = {};
  @Input() type!: 'view';

  agentUserCooperateID: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  newCorpUserDetails: any;
  companyName: any;
  companyRegNumber: any;
  phoneCode: any;
  telephoneNumber: any;
  mobileCode: any;
  mobileNumber: any;
  email: any;
  address: any;
  companyCity: any;
  companyPostalCode: any;
  amlCheckDate: any;
  refCode: any;
  registerDate: any;
  registerFrom: any;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private corporateService: CoperateuserService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit() {
    this.agentUserCooperateID = this.mode.agentUserCooperateId;
  }
}
