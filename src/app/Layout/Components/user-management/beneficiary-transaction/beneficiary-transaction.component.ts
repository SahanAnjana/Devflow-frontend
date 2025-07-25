import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
@Component({
  selector: 'app-beneficiary-transaction',
  templateUrl: './beneficiary-transaction.component.html',
  styleUrls: ['./beneficiary-transaction.component.sass'],
})
export class BeneficiaryTransactionComponent {
  currentIndex = 0;
  totalRecords: any;
  volumeDetails: any;
  currentPageIndex = 1;
  currentPageIndexT = 1;
  currentPageIndexTT = 1;

  prev(): void {
    this.currentIndex = 0;
  }
  @Input() mode: any = {};
  @Input() type!: 'view';

  next() {
    this.currentIndex = this.currentIndex + 1;
  }
  isCoporate = '';
  switchValue = false;
  pageNumber = 1;
  pageSize = 10;
  selectedDuration: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  beneficiaryFirstName: any;
  transactionDetails: any;
  agentName: any;
  sendAmount: any;
  receivedAmount: any;

  pageNumberT = 1;
  pageSizeT = 10;
  totalRecordsT: any;
  pageNumberTT = 1;
  pageSizeTT = 10;
  totalRecordsTT: any;

  tableData = [
    {
      DATE: '05/09/2023',
      AGENT: 'AGENT01',
      BASECURRENCY: 'USD',
      TARGETCURRENCY: 'THB-Thai bath',
      PROVIDERTYPE: 'Monex',
      BUYINGRATE: '1,000,0000',
      SELLINGRATE: '56,0000',
    },
    {
      DATE: '05/09/2023',
      AGENT: 'AGENT01',
      BASECURRENCY: 'USD',
      TARGETCURRENCY: 'USD-USDollears',
      PROVIDERTYPE: 'Monex',
      BUYINGRATE: '1,000,0000',
      SELLINGRATE: '56,0000',
    },
  ];

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private benificiaryService: BenificiaryService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder,
    public modalRef: NzModalRef // private dataService: DataService
  ) {}

  ngOnInit() {
    this.getBasicData();
    //this.getBenificieryVolumeSummery();
    this.selectedDuration = 'SIXMONTHS';
    setTimeout(() => {}, 200);
  }

  getBasicData() {
    const data: any = {};

    data['benificiaryid'] = this.mode.agentBeneficiaryId;
    this.benificiaryService
      .getBasicData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.beneficiaryFirstName =
              res['responseDto']['beneficiaryFirstName'];
            this.getBenificieryTransactionHistory();
            this.getBenificieryVolumeSummery();
            //this.dataService.beniCountryId=this.countryId
          }
        },
      });
    console.log('my god', this.beneficiaryFirstName);
    //this.getBenificieryTransactionHistory()
  }

  getBenificieryTransactionHistory() {
    const data: any = {};

    data['benificiaryId'] = this.mode.agentBeneficiaryId;
    data['pageNumber'] = this.currentPageIndex;
    data['pageSize'] = this.pageSize;
    data['filterCategory'] = this.selectedDuration;
    data['beneficiaryName'] = this.beneficiaryFirstName;

    this.benificiaryService
      .getBenificieryTransactionHistory(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.transactionDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.transactionDetails = [];
            this.totalRecords = 0;
          }
        },
      });
    //this.getBenificieryVolumeSummery()
  }

  getBenificieryVolumeSummery() {
    const data: any = {};

    data['benificiaryId'] = this.mode.agentBeneficiaryId;
    data['pageNumber'] = this.currentPageIndexT;
    data['pageSize'] = this.pageSizeT;
    data['filterCategory'] = this.selectedDuration;
    data['beneficiaryName'] = this.beneficiaryFirstName;

    this.benificiaryService
      .getBenificieryVolumeSummary(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.volumeDetails = res['responseDto']['payload'];
            this.agentName = res['responseDto']['payload']['agentName'];
            this.sendAmount = res['responseDto']['payload']['sendAmount'];
            this.receivedAmount =
              res['responseDto']['payload']['receivedAmount'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.transactionDetails = [];
            this.totalRecordsT = 0;
          }
        },
      });
  }

  getBenificieryVolumeSummeryTT() {
    const data: any = {};

    data['benificiaryId'] = this.mode.agentBeneficiaryId;
    data['pageNumber'] = this.currentPageIndexTT;
    data['pageSize'] = this.pageSizeTT;
    data['filterCategory'] = this.selectedDuration;
    data['beneficiaryName'] = this.beneficiaryFirstName;

    this.benificiaryService
      .getBenificieryVolumeSummary(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.volumeDetails = res['responseDto']['payload'];
            this.agentName = res['responseDto']['payload']['agentName'];
            this.sendAmount = res['responseDto']['payload']['sendAmount'];
            this.receivedAmount =
              res['responseDto']['payload']['receivedAmount'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.transactionDetails = [];
            this.totalRecordsTT = 0;
          }
        },
      });
  }

  downloadExcelReport() {
    const data: any = {};

    data['benificieryId'] = this.mode.agentBeneficiaryId;
    data['filterCategory'] = this.selectedDuration;
    data['beneficiaryName'] = this.beneficiaryFirstName;

    this.benificiaryService.dowmloadBenificieryReport(data).subscribe({
      next: (res) => {},
      error: () => {},
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getBenificieryTransactionHistory();
    //this.getBenificieryVolumeSummery();
  }

  pageIndexChangeT(selectedIndex: any) {
    this.currentPageIndexT = selectedIndex;
    this.pageNumberT = selectedIndex;
    //this.getBenificieryTransactionHistory();
    this.getBenificieryVolumeSummery();
  }

  pageIndexChangeTT(selectedIndex: any) {
    this.currentPageIndexTT = selectedIndex;
    this.pageNumberTT = selectedIndex;
    //this.getBenificieryTransactionHistory();
    this.getBenificieryVolumeSummeryTT();
  }
}
