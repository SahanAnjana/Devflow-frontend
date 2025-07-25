import { Component } from '@angular/core';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { ReportviewComponent } from '../reportview/reportview.component';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddNotesComponent } from './add-notes/add-notes.component';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { style } from '@angular/animations';

interface DataItem {
  transferAmount: number;
  settlementAmount: number;
  adminFee: number;
  agentFee: number;
  payingBy: any;
}
@Component({
  selector: 'app-transfer-summary-report',
  templateUrl: './transfer-summary-report.component.html',
  styleUrls: ['./transfer-summary-report.component.sass'],
})
export class TransferSummaryReportComponent {
  privileges: any = {
    CORE_SHOW_REPORT_VIEW: false,
  };

  clientData: any;
  summaryReportDetails: any = [];
  pageNumber = 1;
  pageSize = 20;
  currentPageIndex = 1;
  totalRecords: any;

  // agentName;
  clientNames: any;
  clientName: any;
  clientNameResult: any;
  dateRange: any;
  transactionFromDate: any;
  transactionToDate: any;
  startTransferAmount = '';
  endTransferAmount = '';
  userTypes: any;
  userType: any;
  userTypeResult: any;
  transferStatus = '';
  // transferModes = [];
  transferMode: any;
  transferReference = '';
  customerReference = '';
  currencies: any;
  currency: any;
  currencyResult: any;
  agentName = '';
  countryName: any;

  todayDate = new Date();
  fromDate: any;
  toDate: any;

  // visibleAgentNamePanel;
  visibleClientNamePanel: any;
  visibleDatePanel: any;
  visibleTransferAmountPanel: any;
  visibleUserTypePanel: any;
  visibleTransferStatusPanel: any;
  visibleTransferModePanel: any;
  visibleTransferReferencePanel: any;
  visibleCustomerReferencePanel: any;
  visibleCurrencyPanel: any;
  visibleAgentNamePanel: any;
  visibleCountryPanel: any;

  // filterByAgentNameOn = false;
  filterByClientNameOn = false;
  filterByDateOn = false;
  filterByTransferAmountOn = false;
  filterByUserTypeOn = false;
  filterByTransferStatusOn = false;
  filterByTransferModeOn = false;
  filterByTransferReferenceOn = false;
  filterByCustomerReferenceOn = false;
  filterByCurrencyOn = false;
  filterByAgentNameOn = false;
  filterByCountryOn = false;

  totalTransTitle: any;
  totalTransCount = 0;
  transAmountTitle: any;
  transAmountCount = 0;
  maxTransTitle: any;
  maxTransClientName: any;
  maxTransAmountCount = 0;
  transStatusTitle: any;
  transStatusCreatedCount = 0;
  transStatusAcceptedCount = 0;
  transStatusPendingCount = 0;
  transStatusSucceededCount = 0;
  transStatusDeclinedCount = 0;
  transStatusFailedCount = 0;

  privilegeCodes: any;
  showDownloadButton = false;
  twoWeek = false;
  showViewReport = false;
  transferApprovedCountries = [];
  agentExposableId: any;
  country: any;
  countryResult = '';
  defaultData!: any[];
  searchValue2!: string;
  crvalue: any;

  transferAmountStart: any;
  transferAmountEND: any;
  currenciestype: any;

  listOfColumn = [
    {
      title: 'TRANSFER AMOUNT',
      compare: (a: DataItem, b: DataItem) =>
        a.transferAmount - b.transferAmount,
      priority: 5,
    },
    {
      title: 'SETTLEMENT AMOUNT',
      compare: (a: DataItem, b: DataItem) =>
        a.settlementAmount - b.settlementAmount,
      priority: 4,
    },
    {
      title: 'ADMIN FEE',
      compare: (a: DataItem, b: DataItem) => a.adminFee - b.adminFee,
      priority: 3,
    },
    {
      title: 'AGENT FEE',
      compare: (a: DataItem, b: DataItem) => a.agentFee - b.agentFee,
      priority: 2,
    },
    {
      title: 'PAYING BY',
      compare: (a: DataItem, b: DataItem) => a.payingBy - b.payingBy,
      priority: 1,
    },
  ];
  listOfData: DataItem[] = [
    {
      transferAmount: 1000,
      settlementAmount: 2000,
      adminFee: 100,
      agentFee: 200,
      payingBy: 'Agent',
    },
  ];
  reportdetails: any = [];
  totalRecord: any;
  currenci: any;
  // fromDate = '';
  // toDate = '';
  carddetails: any;
  carddetails1: any;
  transferAmount = '';
  transferAs = '';
  transactionRef = '';
  customerRef = '';
  usertype = '';
  transferModes: any;
  editDetails: any;
  getdata: any;
  bankData: any;
  isBeneficiaryEditable: any;
  isBeneficiaryBankEditable: any;
  clickhide = false;
  settlementAmount: any;
  reportPrivilage: any = [];
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,

    private dataService: DataService,
    private notification: NzNotificationService,
    private commonsService: CommonsService,
    private nzModalservice: NzModalService,
    private report: ReportService, // private clientNamesDataServices: ClientNamesDataService, // private userTypesDataService: UserTypesDataService, // private reportsDataService: ReportsDataService, // private transactionModeDataService: TransactionModeDataService, // private privilegeService: PrivilegeService, // private currencyDataService: CurrencyDataService, // private countryDataService: CountryDataService
    private eventTriggerService: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.clientData = this.commonsService.parseJwt(
      localStorage.getItem('currentUser')
    );

    this.allPrivilages = this.tokenService.getPrivileges();
    console.log('Retrieved privileges:', this.allPrivilages);
  }

  ngOnInit() {
    this.getUserPrivilegeDetails();
    this.getreportdetails();
    this.getClientNames();
    this.getUsertypes();
    this.getTransferModes();
    this.getCurrencies();
    // this.getBankAccount();
    // this.checkBeneficiary();
    // this.checkBeneficiaryBank();

    this.getTransferApprovedCountriesBySendingReceivingId();
    this.getcarddetails();
    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'getAllData') {
          this.getreportdetails();
        }
      },
    });
  }

  callPrivilageApi() {
    // this.tokenService.getPrivilages();
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_REPORT_VIEW') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_REPORT_VIEW = true)
          : false;
      }
    });
  }

  disabledFutureDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };

  mapOfSort: { [key: string]: any } = {
    clientName: null,
    transactionDate: null,
    agentName: null,
    transactionReferencenull: null,
    sendAmount: null,
    totalPayable: null,
    monexFee: null,
    paymentModeDesc: null,
    agentFee: null,
    transactionModeDesc: null,
    customerReference: null,
  };
  sortName: string | null = null;
  sortValue: string | null = null;
  searchValue = '';
  listOfTransferAmount: string[] = [];
  listOfSearchAddress: string[] = [];
  listOfSearchAddress2: string[] = [];

  reset(): void {
    this.searchValue = '';
    this.search();
    this.summaryReportDetails = this.defaultData;
  }

  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.mapOfSort) {
      this.mapOfSort[key] = key === sortName ? value : null;
    }
    this.search();
  }

  search(): void {
    const filterFunc = (item: { transactionReferenceNumber: string }) => {
      return (
        (this.listOfSearchAddress.length
          ? this.listOfSearchAddress.some(
              (address) =>
                item.transactionReferenceNumber.indexOf(address) !== -1
            )
          : true) &&
        item.transactionReferenceNumber.indexOf(this.searchValue) !== -1
      );
    };

    const data = this.defaultData.filter(
      (item: {
        customerReference: string;
        transactionReferenceNumber: string;
      }) => filterFunc(item)
    );

    this.summaryReportDetails = data.sort((a, b) =>
      this.sortValue === 'ascend'
        ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
        : b[this.sortName!] > a[this.sortName!]
        ? 1
        : -1
    );
  }

  customRefrenceFilter(): void {
    this.summaryReportDetails = this.defaultData.filter((itm) =>
      itm.customerReference.toLowerCase().includes(this.crvalue.toLowerCase())
    );
  }
  getreportdetails() {
    this.clickhide = true;
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['clientName'] = this.clientName ? this.clientName : '';
    data['userType'] = this.usertype ? this.usertype : '';
    data['country'] = this.countryName ? this.countryName : '';
    data['fromDate'] = this.fromDate ? format(this.fromDate, 'dd/MM/yyyy') : '';
    data['toDate'] = this.toDate ? format(this.toDate, 'dd/MM/yyyy') : '';
    data['startAmount'] = this.transferAmountStart;
    data['endAmount'] = this.transferAmountEND;
    data['transferStatus'] = this.transferStatus ? this.transferStatus : '';
    data['transferAs'] = this.transferMode ? this.transferMode : '';
    data['transactionRef'] = this.transactionRef ? this.transactionRef : '';
    data['customerRef'] = this.customerRef;
    data['currency'] = this.currenci ? this.currenci : '';
    data['agentName'] = this.agentName ? this.agentName : '';

    this.dataService.summaryReport = data;
    this.report.getreportdetails(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.reportdetails = res['responseDto']['reportData']['payload'];
          this.totalRecord = res['responseDto']['reportData']['totalRecords'];
          // this.transferlimitdetails = this.dataService.value;
        } else if (res['errorDescription']) {
          this.notification.create('error', 'Error', res['errorDescription'], {
            nzStyle: {
              background: '#cc2d2d',
              color: '#fff',
            },
          });

          this.reportdetails = [];
          this.totalRecord = '';
        }
      },

      error: (err) => {},
    });
  }
  formatCurrency(currency: string): string {
    const currencyCode = currency?.substring(currency.length - 3);
    const amount = parseFloat(currency?.substring(0, currency.length - 4));
    return currencyCode + ' ' + amount.toFixed(2);
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getreportdetails();
  }
  getcarddetails() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.report.getcarddetails(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.carddetails = res['responseDto'];
          this.carddetails1 = res['responseDto'][0]['tiledata'];

          // this.transferlimitdetails = this.dataService.value;
        }
        // console.log('card details', this.carddetails1);
      },

      error: (err) => {},
    });
  }
  // pageIndexChange(selectedIndex:any) {
  //   this.currentPageIndex = selectedIndex;
  //   this.pageNumber = selectedIndex;
  //   this.getSummaryReportData();
  // }
  getSummaryReportData() {
    if (this.clientName === undefined) {
      this.clientName = '';
    }
    if (
      this.transactionFromDate === undefined &&
      this.transactionToDate === undefined
    ) {
      this.transactionFromDate = '';
      this.transactionToDate = '';
      this.filterByDateOn = false;
    }
    if (this.userType === undefined) {
      this.userType = '';
    }
    if (this.transferMode === undefined) {
      this.transferMode = '';
      this.filterByTransferModeOn = false;
    }
    if (this.currency === undefined) {
      this.currency = '';
    }

    const data: any = {};
    // data["clientCode"] = this.clientData.client_code;
    // data["userName"] = this.clientData.sub;
    data['range'] = '';
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    data['invoiceNo'] = '';
    data['transactionFromDate'] = this.transactionFromDate;
    data['transactionToDate'] = this.transactionToDate;
    data['countryName'] = '';
    data['transactionFromAmount'] = this.startTransferAmount;
    data['transactionToAmount'] = this.endTransferAmount;
    data['origin'] = 'CORE';
    data['client_Code'] = this.clientName;
    data['transactionStatus'] = this.transferStatus;
    data['transactionMode'] = this.transferMode;
    data['userType'] = this.userType;
    data['referenceNumber'] = this.transferReference;
    data['customerReferenceNumber'] = this.customerReference;
    data['recievingCurrency'] = this.currency;
    data['agentName'] = this.agentName;
    data['csTeam'] = this.twoWeek;
    data['country'] = this.countryResult;
    // this.reportsDataService
    //   .getSummaryReportDataByClientCodeWithAgent(data)
    //   .subscribe((res:any) => {
    //     if (
    //       res["responseDto"] === null ||
    //       res["responseDto"].reportData === null
    //     ) {
    //       this.summaryReportDetails = [];
    //       this.totalRecords = 0;
    //     } else {
    //       this.totalRecords = res["responseDto"].reportData.totalRecords;
    //       this.summaryReportDetails = res["responseDto"].reportData.payload;
    //       this.defaultData = this.summaryReportDetails;
    //     }
    //   });
  }

  getSummaryReportFilteredData() {
    if (this.clientName === undefined) {
      this.clientName = '';
    }
    if (
      this.transactionFromDate === undefined &&
      this.transactionToDate === undefined
    ) {
      this.transactionFromDate = '';
      this.transactionToDate = '';
      this.filterByDateOn = false;
    }
    if (this.userType === undefined) {
      this.userType = '';
    }
    if (this.transferMode === undefined) {
      this.transferMode = '';
      this.filterByTransferModeOn = false;
    }
    if (this.currency === undefined) {
      this.currency = '';
    }
    this.getUserPrivilegeDetails();
    const data: any = {};
    data['clientCode'] = this.clientData.client_code;
    data['userName'] = this.clientData.sub;
    data['range'] = '';
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    data['invoiceNo'] = '';
    data['transactionFromDate'] = this.transactionFromDate;
    data['transactionToDate'] = this.transactionToDate;
    data['countryName'] = '';
    data['transactionFromAmount'] = this.startTransferAmount;
    data['transactionToAmount'] = this.endTransferAmount;
    data['origin'] = 'CORE';
    data['client_Code'] = this.clientName;
    data['transactionStatus'] = this.transferStatus;
    data['transactionMode'] = this.transferMode;
    data['userType'] = this.userType;
    data['referenceNumber'] = this.transferReference;
    data['customerReferenceNumber'] = this.customerReference;
    data['recievingCurrency'] = this.currency;
    data['agentName'] = this.agentName;
    data['country'] = this.countryResult;
    // this.reportsDataService
    //   .getSummaryReportDataByClientCodeWithAgent(data)
    //   .subscribe((res:any) => {
    //     if (
    //       res["responseDto"] === null ||
    //       res["responseDto"].reportData === null
    //     ) {
    //       this.summaryReportDetails = [];
    //       this.totalRecords = 0;
    //     } else {
    //       this.totalRecords = res["responseDto"].reportData.totalRecords;
    //       this.summaryReportDetails = res["responseDto"].reportData.payload;
    //       this.defaultData = this.summaryReportDetails;
    //     }
    //     this.getWidgetCountDetails();
    //   });
  }

  getWidgetCountDetails() {
    if (this.clientName === undefined) {
      this.clientName = '';
    }
    if (
      this.transactionFromDate === undefined &&
      this.transactionToDate === undefined
    ) {
      this.transactionFromDate = '';
      this.transactionToDate = '';
      this.filterByDateOn = false;
    }
    if (this.userType === undefined) {
      this.userType = '';
    }
    if (this.transferMode === undefined) {
      this.transferMode = '';
      this.filterByTransferModeOn = false;
    }
    if (this.currency === undefined) {
      this.currency = '';
    }

    const data: any = {};
    data['clientCode'] = this.clientData.client_code;
    data['userName'] = this.clientData.sub;
    data['range'] = '';
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    data['invoiceNo'] = '';
    data['transactionFromDate'] = this.transactionFromDate;
    data['transactionToDate'] = this.transactionToDate;
    data['countryName'] = '';
    data['transactionFromAmount'] = this.startTransferAmount;
    data['transactionToAmount'] = this.endTransferAmount;
    data['origin'] = 'CORE';
    data['client_Code'] = this.clientName;
    data['transactionStatus'] = this.transferStatus;
    data['transactionMode'] = this.transferMode;
    data['userType'] = this.userType;
    data['referenceNumber'] = this.transferReference;
    data['customerReferenceNumber'] = this.customerReference;
    data['recievingCurrency'] = this.currency;
    data['agentName'] = this.agentName;
    data['csTeam'] = this.twoWeek;
    data['country'] = this.countryResult;

    // this.reportsDataService
    //   .getSummaryReportWidgetCountsWithAgent(data)
    //   .subscribe((res:any) => {
    //     if (res["responseDto"] === null || res["responseDto"].tiles === null) {
    //       this.totalTransCount = 0;
    //       this.transAmountCount = 0;
    //       this.maxTransAmountCount = 0;
    //       this.transStatusCreatedCount = 0;
    //       this.transStatusAcceptedCount = 0;
    //       this.transStatusPendingCount = 0;
    //       this.transStatusSucceededCount = 0;
    //       this.transStatusDeclinedCount = 0;
    //       this.transStatusFailedCount = 0;
    //     } else {
    //       this.totalTransTitle = res["responseDto"].tiles[0].title;
    //       this.totalTransCount = res["responseDto"].tiles[0].tiledata[0].value;
    //       this.transAmountTitle = res["responseDto"].tiles[1].title;
    //       this.transAmountCount = res["responseDto"].tiles[1].tiledata[0].value;
    //       this.maxTransClientName =
    //         res["responseDto"].tiles[2].tiledata[0].value;
    //       this.maxTransAmountCount =
    //         res["responseDto"].tiles[2].tiledata[1].value;
    //       this.transStatusTitle = res["responseDto"].tiles[3].title;
    //       this.transStatusCreatedCount =
    //         res["responseDto"].tiles[3].tiledata[0].value;
    //       this.transStatusAcceptedCount =
    //         res["responseDto"].tiles[3].tiledata[1].value;
    //       this.transStatusPendingCount =
    //         res["responseDto"].tiles[3].tiledata[2].value;
    //       this.transStatusSucceededCount =
    //         res["responseDto"].tiles[3].tiledata[3].value;
    //       this.transStatusDeclinedCount =
    //         res["responseDto"].tiles[3].tiledata[4].value;
    //       this.transStatusFailedCount =
    //         res["responseDto"].tiles[3].tiledata[5].value;
    //     }
    //   });
  }

  getClientNames() {
    this.report.gettclientname().subscribe((res) => {
      this.clientNames = res['responseDto'];
      this.getcountry(this.clientNames[0].clientCode);
    });
  }

  getUsertypes() {
    this.report.getusertype().subscribe((res) => {
      this.userTypes = res['responseDto'];
    });
  }

  getTransferModes() {
    this.report.gettransactionmode().subscribe((res: any) => {
      this.transferModes = res['responseDto'];
    });
  }

  getCurrencies() {
    this.report.getcurrencies().subscribe((res: any) => {
      this.currencies = res['responseDto'];
    });
  }
  getcountry(id: any) {
    const data: any = {};
    data['clientCode'] = id;
    this.report.getcountry(data).subscribe((res: any) => {
      this.country = res['responseDto'];
    });
  }

  // filterByAgentName() { }
  // resetFilterByAgentName() { }
  // filterbyclientname(clientName: any) {
  //   this.getreportdetails(clientName);
  // }
  // filterByClientName() {
  //   this.getreportdetails(this.clientName);
  //   this.close();
  // }
  close() {}

  resetFilterByClientName() {
    // this.visibleClientNamePanel = false;
    // this.filterByClientNameOn = false;
    this.clientName = '';
    this.clientNameResult = undefined;
    this.dataService.summaryReport.agentName = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
  }

  filterByDate() {
    this.visibleDatePanel = false;

    if (this.dateRange !== undefined) {
      this.transactionFromDate = format(this.dateRange, 'dd-MM-yyyy');
      this.transactionToDate = format(this.dateRange, 'dd-MM-yyyy');
    }

    this.filterByDateOn = true;
    this.getSummaryReportFilteredData();
  }

  getDetailById(receivedData: any) {
    const data: any = {};
    data['agentTransactionDetailsId'] = receivedData;

    this.report.getdetailsofreport(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.editTaxDetails(res['responseDto']);
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notification.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#ffffff' },
          });
        }
        // console.log('output', this.editDetails);
      },
    });
  }

  editTaxDetails(receivedData: any) {
    this.dataService.reportdata = receivedData;
    // console.log('output', receivedData);
    const modal = this.nzModalservice.create({
      nzContent: ReportviewComponent,

      nzClassName: 'view',
      nzWidth: 1012,
      nzFooter: null,
    });
    modal.afterClose.subscribe({
      next: () => {
        this.getreportdetails();
      },
    });

    // modal.componentInstance!.mode = receivedData;
  }

  resetFilterByDate() {
    this.visibleDatePanel = false;
    this.transactionFromDate = '';
    this.transactionToDate = '';
    this.dateRange = '';
    this.filterByDateOn = false;
    (this.fromDate = ''), (this.toDate = '');
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.fromDate = '';
    this.dataService.summaryReport.toDate = '';
  }

  filterByTransferAmount() {
    this.visibleTransferAmountPanel = false;
    this.filterByTransferAmountOn = true;
    this.getSummaryReportFilteredData();
  }

  resetFilterByTransferAmount() {
    this.visibleTransferAmountPanel = false;
    this.filterByTransferAmountOn = false;
    this.startTransferAmount = '';
    this.endTransferAmount = '';
    (this.transferAmountStart = ''), (this.transferAmountEND = '');
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.startAmount = '';
    this.dataService.summaryReport.endAmount = '';
  }

  filterByUserType() {
    // this.getreportdetails(this.userType);
    // this.visibleUserTypePanel = false;
    // this.filterByUserTypeOn = true;
    // if (this.userTypeResult !== undefined) {
    //   this.userType = this.userTypeResult.userTypeDesc;
    // }
    // this.getSummaryReportFilteredData();
  }

  resetFilterByUserType() {
    this.visibleUserTypePanel = false;
    this.filterByUserTypeOn = false;
    this.userType = '';
    this.userTypeResult = undefined;
    this.usertype = '';
    this.getreportdetails();
    this.dataService.summaryReport.userType = '';
    this.getSummaryReportFilteredData();
  }

  filterByTransferStatus() {
    this.visibleTransferStatusPanel = false;
    this.filterByTransferStatusOn = true;
    this.getSummaryReportFilteredData();
  }

  resetFilterByTransferStatus() {
    this.visibleTransferStatusPanel = false;
    this.filterByTransferStatusOn = false;
    this.transferStatus = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.transferStatus = '';
  }

  filterByTransferMode() {
    this.visibleTransferModePanel = false;
    this.filterByTransferModeOn = true;
    this.getSummaryReportFilteredData();
  }

  resetFilterByTransferMode() {
    this.visibleTransferModePanel = false;
    this.filterByTransferModeOn = false;
    this.transferMode = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.transferAs = '';
  }

  filterByTransferReference() {
    this.visibleTransferReferencePanel = false;
    this.filterByTransferReferenceOn = true;
    this.getSummaryReportFilteredData();
  }

  resetFilterByTransferReference() {
    this.visibleTransferReferencePanel = false;
    this.filterByTransferReferenceOn = false;
    this.transferReference = '';
    this.transactionRef = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.transactionRef = '';
  }

  filterByCustomerReference() {
    this.visibleCustomerReferencePanel = false;
    this.filterByCustomerReferenceOn = true;
    this.getSummaryReportFilteredData();
  }

  resetFilterByCustomerReference() {
    this.visibleCustomerReferencePanel = false;
    this.filterByCustomerReferenceOn = false;
    this.customerReference = '';
    this.customerRef = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.customerRef = '';
  }

  filterByCurrency() {
    this.visibleCurrencyPanel = false;
    this.filterByCurrencyOn = true;

    if (this.currencyResult !== undefined) {
      this.currency = this.currencyResult.currencyCode;
    }

    this.getSummaryReportFilteredData();
  }

  resetFilterByCurrency() {
    this.visibleCurrencyPanel = false;
    this.filterByCurrencyOn = false;
    this.currency = '';
    this.currencyResult = undefined;
    this.currenci = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.currency = '';
  }

  resetFilterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = false;
    this.agentName = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.agentName = '';
  }

  filterByAgentName() {
    this.visibleAgentNamePanel = false;
    this.filterByAgentNameOn = true;
    this.getSummaryReportFilteredData();
  }
  resetFilterByCountry() {
    this.visibleCountryPanel = false;
    this.filterByCountryOn = false;
    this.countryResult = '';
    this.countryName = '';
    this.getreportdetails();
    this.getSummaryReportFilteredData();
    this.dataService.summaryReport.country = '';
  }

  filterByCountry() {
    this.visibleCountryPanel = false;
    this.filterByCountryOn = true;
    this.countryResult = this.country.countryDto.countryId;
    this.getSummaryReportFilteredData();
  }
  viewBeneficiary(receivedData: any) {
    this.dataService.selectedData = receivedData;
    // this.modalService.createComponentModal(
    //   ViewBeneficiaryModalComponent,
    //   "",
    //   "",
    //   "",
    //   700
    // );
  }

  viewDetails(receivedData: any) {
    this.dataService.selectedData = receivedData;
    // this.modalService.createComponentModal(
    //   TransferSummaryDetailModalComponent,
    //   "",
    //   "",
    //   "",
    //   900
    // );
  }

  viewTransferDetail(data: any) {
    this.dataService.selectedData = data;
    // this.modalService.createComponentModal(
    //   ViewTransferDetailStepsComponent,
    //   "&nbsp;",
    //   "",
    //   "",
    //   1000
    // );
  }

  downloadReport() {
    if (this.clientName === undefined) {
      this.clientName = '';
    }
    if (
      this.transactionFromDate === undefined &&
      this.transactionToDate === undefined
    ) {
      this.transactionFromDate = '';
      this.transactionToDate = '';
      this.filterByDateOn = false;
    }
    if (this.userType === undefined) {
      this.userType = '';
    }
    if (this.transferMode === undefined) {
      this.transferMode = '';
      this.filterByTransferModeOn = false;
    }
    if (this.currency === undefined) {
      this.currency = '';
    }

    const data: any = {};
    data['clientCode'] = this.clientData.client_code;
    data['userName'] = this.clientData.sub;
    data['range'] = '';
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    data['invoiceNo'] = '';
    data['transactionFromDate'] = this.transactionFromDate;
    data['transactionToDate'] = this.transactionToDate;
    data['countryName'] = '';
    data['transactionFromAmount'] = this.startTransferAmount;
    data['transactionToAmount'] = this.endTransferAmount;
    data['origin'] = 'CORE';
    data['client_Code'] = this.clientName;
    data['transactionStatus'] = this.transferStatus;
    data['transactionMode'] = this.transferMode;
    data['userType'] = this.userType;
    data['referenceNumber'] = this.transferReference;
    data['customerReferenceNumber'] = this.customerReference;
    data['sendingCurrency'] = this.currency;
    data['agentName'] = this.agentName;
    data['csTeam'] = this.twoWeek;
    data['recievingCurrency'] = this.currency;
    // this.reportsDataService
    //   .downloadSummaryReportWithAgent(data)
    //   .subscribe((res) => {
    //     if (res) {
    //       console.log(res);
    //     }
    //   });
  }

  getUserPrivilegeDetails() {
    // const data = this.clientData.sub;
    // this.privilegeService.getUserPrivilegeData(data).subscribe((res:any) => {
    //   this.privilegeCodes = res["responseDto"];
    //   if (this.privilegeCodes.includes("CORE_SHOW_REPORT_TWO_WEEK")) {
    //     this.twoWeek = true;
    //     this.getSummaryReportData();
    //     this.getWidgetCountDetails();
    //   } else {
    //     this.getSummaryReportData();
    //     this.getWidgetCountDetails();
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_REPORTS_DOWNLOAD_BUTTON")) {
    //     this.showDownloadButton = true;
    //   }
    //   if (this.privilegeCodes.includes("CORE_SHOW_REPORT_VIEW")) {
    //     this.showViewReport = true;
    //   }
    // });
  }

  addNotes(id: any) {
    const data: any = {};
    data['agentTransactionDetailsId'] = id;

    this.report.getdetailsofreport(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.dataService.transactionDetailsForAddNote = res['responseDto'];
        this.addNote(this.dataService.transactionDetailsForAddNote);
      }
    });
  }

  addNote(value: any) {
    // this.dataService.selectedData = receivedData.email;
    // this.dataService.transactionDetailId = receivedData.transactionDetailId;

    const modal = this.modalService.create({
      nzTitle: 'Add Notes',
      nzContent: AddNotesComponent,
      nzClassName: 'Add Notes',
      nzFooter: null,
      nzWidth: 720,
    });
    modal.componentInstance!.mode = value;
  }

  getTransferApprovedCountriesBySendingReceivingId() {
    // const data = this.clientData.client_code;
    // this.countryDataService
    //   .getCountryDataByClientCode(data)
    //   .subscribe((res:any) => {
    //     this.transferApprovedCountries = res["responseDto"];
    //   });
  }
}
