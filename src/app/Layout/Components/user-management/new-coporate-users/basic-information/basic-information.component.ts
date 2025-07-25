import { Component, Input, ViewChild } from '@angular/core';
import { NewCorporateMainComponent } from '../new-corporate-main/new-corporate-main.component';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.sass'],
})
export class BasicInformationComponent {
  @Input() mode: any;

  @Input() incomingAgentUserCooperateId: any;

  @ViewChild(NewCorporateMainComponent)
  newCorpViewData!: NewCorporateMainComponent;

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
  country: any;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private corporateService: CoperateuserService,
    private notificationService: NzNotificationService,
    private reportService: ReportService,
    private modalRef: NzModalRef,
    private dataService: DataService
  ) {}
  ngOnInit() {
    this.getAllNewUserViewDetails();
    console.log('basic information1', this.mode.agentUserCooperateId);
    console.log('basic information2', this.mode.incomingAgentUserCooperateId);
  }

  getAllNewUserViewDetails() {
    const data: any = {};

    data['agentUserCooperateSenderDetailsId'] =
      this.dataService.agentCorporateDetails.agentUserCooperateId;

    this.corporateService
      .getAllNewUserViewDetails(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.newCorpUserDetails = res['responseDto'];
            this.companyName =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'companyName'
              ];
            this.companyRegNumber =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'companyRegNumber'
              ];
            this.phoneCode =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'phoneCode'
              ];
            this.telephoneNumber =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'telephoneNumber'
              ];
            this.mobileCode =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'mobileCode'
              ];
            this.mobileNumber =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'mobileNumber'
              ];
            this.email =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'email'
              ];
            this.address =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'address'
              ];
            this.companyCity =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'companyCity'
              ];
            this.companyPostalCode =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'companyPostalCode'
              ];
            this.amlCheckDate =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'amlCheckDate'
              ];
            this.refCode =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'refCode'
              ];
            this.registerDate =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'registerDate'
              ];
            this.registerFrom =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'registerFrom'
              ];
            this.country =
              res['responseDto'][0]['agentUserCooperateSenderDetailsId'][
                'country'
              ];
          }
        },
      });
  }

  downloadDoc() {
    const data: any = {};

    data['agentTransactionId'] = this.mode.agentUserCooperateId;

    this.corporateService.downLoadReport(data).subscribe((res) => {
      if (res) {
        console.log(res);
      }
    });
  }

  declineStatus() {
    const data: any = {};

    data['requestType'] = 1;
    data['email'] = this.mode.email;
    data['isApprove'] = false;

    this.corporateService
      .updateCorporateStaus(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            const msg = res['responseDto'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffff' },
            });
          } else {
            this.notificationService.create('error', 'Error', 'update failed', {
              nzStyle: { background: '#cc2d2d', color: '#ffff' },
            });
          }
        },
      });
  }

  accepet() {
    const data: any = {};
    data['requestType'] = 1;
    data['email'] = this.mode.email;
    data['isApprove'] = true;

    this.corporateService
      .updateCorporateStaus(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            const msg = res['responseDto'];
            this.notificationService.create('success', 'Success', msg, {
              nzStyle: { background: '#00A03E', color: '#ffff' },
            });
            this.close();
          } else {
            this.notificationService.create('error', 'Error', 'update failed', {
              nzStyle: { background: '#cc2d2d', color: '#ffff' },
            });
          }
        },
      });
  }

  close() {
    this.modalRef.close();
    this.getAllNewUserViewDetails();
  }
}
