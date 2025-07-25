import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SendMailsComponent } from '../../send-mails/send-mails.component';
import { AddNotesComponent } from '../../add-notes/add-notes.component';
import { ViewTransferComponent } from '../../view-transfer/view-transfer.component';

import { TransferAmountComponent } from '../transfer-amount/transfer-amount.component';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { differenceInCalendarDays, format } from 'date-fns';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.sass'],
})
export class TransferComponent {
  privileges: any = {
    CORE_SHOW_TRANSFERS_ACCEPT_BUTTON: false,
    CORE_SHOW_TRANSFERS_DECLINE_BUTTON: false,
    CORE_SHOW_TRANSFERS_PAYMENT_RECEIVED_TOOGLE: false,
    CORE_SHOW_TRANSFERS_SENDING_AMOUNT_EDIT_POPUP: false,
    CORE_SHOW_TRANSFER_VIEW: false,
    CORE_SHOW_DECLINE_TRANSACTION: false,
  };
  TransferDetails: any;
  totalRecords: any;
  currentPageIndex = 1;
  todayDate = new Date();
  pageNumber = 1;
  pageSize = 10;
  editDetails: any;
  agentName: any;

  senderName: any;
  visibleClientNamePanel: any;
  filterByClientNameOn: any;
  clientNameResult: any;
  beneficiaryCountryName: any;
  customerReference: any;
  transactionFromDate: any;
  transactionToDate: any;
  paymentMode: any;
  country: any;
  clientNames: any;
  type: any;
  isTrnxLimitExceeded = false;
  isVisible: boolean = false;
  declinedTrnxId: any;

  executionTypes = [
    {
      label: 'MANUAL',
      value: 'MANUAL',
    },
    {
      label: 'TERRAPAY',
      value: 'TERRAPAY',
    },
    {
      label: 'CARGILLS',
      value: 'CARGILLS',
    },
    {
      label: 'LINKFX',
      value: 'LINKFX',
    },
  ];

  allPrivilages: any;

  constructor(
    private modalservice: NzModalService,
    private transferService: TransferTabService,
    private eventTrigger: EventTriggerService,
    private notification: NzNotificationService,
    private dataService: DataService,
    private nzModalservice: NzModalService,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }
  ngOnInit() {
    this.getTransferDetails();
    this.eventTrigger.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'amount') {
          this.getTransferDetails();
        }
      },
    });
    this.getClientNames();
    this.eventTrigger.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_TRANSFERS_ACCEPT_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_TRANSFERS_ACCEPT_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_TRANSFERS_DECLINE_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_TRANSFERS_DECLINE_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_TRANSFERS_PAYMENT_RECEIVED_TOOGLE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_TRANSFERS_PAYMENT_RECEIVED_TOOGLE = true)
          : false;
      }
      if (
        data.privilegeCode == 'CORE_SHOW_TRANSFERS_SENDING_AMOUNT_EDIT_POPUP'
      ) {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_TRANSFERS_SENDING_AMOUNT_EDIT_POPUP =
              true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_TRANSFER_VIEW') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_TRANSFER_VIEW = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_DECLINE_TRANSACTION') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_DECLINE_TRANSACTION = true)
          : false;
      }
    });
  }
  disabledFutureDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };
  getDetailById(receivedData: any) {
    console.log('output', receivedData);
    const data: any = {};
    data['agentTransactionDetailId'] = receivedData.transactionDetailId;

    this.transferService.getdetailsoftransfer(data).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.editTaxDetails(res['responseDto']);
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notification.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#ffffff' },
          });
        }
        console.log('output', this.editDetails);
      },
    });
  }
  editTaxDetails(receivedData: any) {
    this.dataService.transferdata = receivedData;
    this.modalservice.create({
      nzContent: ViewTransferComponent,
      nzClassName: 'view-transfers',
      nzFooter: null,
      nzWidth: 1012,
    });

    // modal.componentInstance!.mode = receivedData;
  }
  // view() {
  //
  // }
  sendEmail(receivedData: any) {
    const modal = this.modalservice.create({
      nzTitle: 'Send New Email',
      nzContent: SendMailsComponent,
      nzClassName: 'send_email',
      nzFooter: null,
    });
    modal.componentInstance!.mode = receivedData;
  }

  addNotes(receivedData: any) {
    console.log(receivedData);

    this.dataService.senderMail = receivedData.email;
    this.dataService.agentSenderDetailsId = receivedData.transactionDetailId;
    this.modalservice.create({
      nzTitle: 'Add Notes',
      nzContent: AddNotesComponent,
      nzClassName: 'send_email',
      nzFooter: null,
      nzWidth: 720,
    });
  }
  changeTransferAmount(receivedData: any, type: any) {
    console.log('type value', type);
    if (type === 'sendAmount') {
      if (this.privileges.CORE_SHOW_TRANSFERS_SENDING_AMOUNT_EDIT_POPUP) {
        const modal = this.modalservice.create({
          nzContent: TransferAmountComponent,
          nzClassName: 'transferAmount',
          nzTitle: 'Edit Sending Amount',
          nzFooter: null,
          nzWidth: 490,
        });
        modal.componentInstance!.mode = receivedData;
        modal.componentInstance!.type = type;
      }
    } else if (type === 'receivedAmount') {
      const modal = this.modalservice.create({
        nzContent: TransferAmountComponent,
        nzClassName: 'transferAmount',
        nzTitle: 'Edit Receving Amount',
        nzFooter: null,
        nzWidth: 490,
      });
      modal.componentInstance!.mode = receivedData;
      modal.componentInstance!.type = type;
    }
  }
  resetFilterByagentName() {
    this.agentName = '';

    this.getTransferDetails();
    // this.getSummaryReportFilteredData();
  }
  resetFilterBytransferref() {
    this.customerReference = '';

    this.getTransferDetails();
    // this.getSummaryReportFilteredData();
  }
  resetFilterBycountry() {
    this.beneficiaryCountryName = '';

    this.getTransferDetails();
    // this.getSummaryReportFilteredData();
  }
  resetFiltersendername() {
    this.senderName = '';

    this.getTransferDetails();
    // this.getSummaryReportFilteredData();
  }
  resetFilterBydate() {
    this.transactionFromDate = '';
    this.transactionToDate = '';

    this.getTransferDetails();
    // this.getSummaryReportFilteredData();
  }
  switchValue = false;
  getTransferDetails() {
    const data: any = {};
    data['customerReference'];
    data['transferReference'] = this.customerReference
      ? this.customerReference
      : '';
    data['countryName'] = this.beneficiaryCountryName
      ? this.beneficiaryCountryName
      : '';
    data['transactionFromDate'] = this.transactionFromDate
      ? format(this.transactionFromDate, 'yyyy-MM-dd')
      : '';
    data['transactionToDate'] = this.transactionToDate
      ? format(this.transactionToDate, 'yyyy-MM-dd')
      : '';
    data['agentName'] = this.agentName ? this.agentName : '';
    data['senderName'] = this.senderName;
    data['pageSize'] = this.pageSize;
    data['pageNumber'] = this.pageNumber;
    return this.transferService.transactionGetAll(data).subscribe((res) => {
      if (res['responseDto']) {
        this.TransferDetails = res['responseDto']['payload'];

        this.totalRecords = res['responseDto']['totalRecords'];
      } else {
        this.TransferDetails = [];
      }
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getTransferDetails();
  }
  changeStatus(status: any) {
    const data: any = {};
    data['transactionMasterId'] = status.transactionMasterId;
    data['transactionDetailId'] = status.transactionDetailId;
    data['isPaymentReceived'] = status.paymentReceivedStatus;
    return this.transferService
      .markPaymentReceived(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.createNotification(
            'success',
            'Success',
            'Payment Status Updated successfully',
            '#ffffff',
            '#00A03E'
          );
          this.eventTrigger.onReloadServiceData('amount');
        } else {
          this.createNotification(
            'error',
            'Input Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
          this.eventTrigger.onReloadServiceData('amount');
        }
      });
  }
  getClientNames() {
    this.transferService.gettclientname().subscribe((res) => {
      this.clientNames = res['responseDto'];
      this.getcountry(this.clientNames[0].clientCode);
    });
  }
  getcountry(id: any) {
    const data: any = {};
    data['clientCode'] = id;
    this.transferService.getcountry(data).subscribe((res: any) => {
      this.country = res['responseDto'];
    });
  }
  declineTrnx(id: any) {
    const data: any = {};
    data['transactionDetailId'] = id;
    data['transactionStatus'] = 'CANCELLED';
    return this.transferService.changeTrnx(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'Payment Declined successfully',
          '#ffffff',
          '#00A03E'
        );
        this.eventTrigger.onReloadServiceData('amount');
      } else {
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
        this.eventTrigger.onReloadServiceData('amount');
      }
    });
  }

  cancel(): void {}
  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notification.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
  // getDetailById(receivedData: any) {
  //   const data: any = {};
  //   data['agentTransactionMasterId'] = receivedData;

  //   this.report.getdetailsofreport(data).subscribe({
  //     next: (res) => {
  //       if (res['responseDto']) {
  //         this.editTaxDetails(res['responseDto']);
  //       } else if (res['errorDescription']) {
  //         const msg = res['errorDescription'];
  //         this.notification.create('error', 'Error', msg, {
  //           nzStyle: { background: '#cc2d2d', color: '#ffffff' },
  //         });
  //       }
  //       console.log('output', this.editDetails);
  //     },
  //   });
  // }
  selectexecutionType(receivedData: any, type: any) {
    console.log(type);
    this.type = type;
    this.checkTransferLimitation(receivedData);
    if (this.type == 'MANUAL') {
      this.addNotes(receivedData);
      this.onselectexecuteManual(receivedData);
    } else if (this.type == 'TERRAPAY') {
      this.executeTarraPay(receivedData);
    } else if (this.type == 'CARGILLS') {
      this.executeCargills(receivedData);
    }
  }
  excute(receivedData: any) {
    if (this.type === 'MANUAL' || receivedData.executionType === 'MANUAL') {
      if (this.isTrnxLimitExceeded == false) {
        this.executeManual(receivedData);
      } else {
        this.createNotification(
          'error',
          'Input Error',
          'Transaction Limit Exceeded',
          '#ffffff',
          '#cc2d2d'
        );
      }
    } else if (
      this.type === 'TERRAPAY' ||
      receivedData.executionType === 'TERRAPAY'
    ) {
      if (this.isTrnxLimitExceeded == false) {
        this.executeManual(receivedData);
      } else {
        this.createNotification(
          'error',
          'Input Error',
          'Transaction Limit Exceeded',
          '#ffffff',
          '#cc2d2d'
        );
      }
    } else if (
      this.type === 'CARGILLS' ||
      receivedData.executionType === 'CARGILLS'
    ) {
      if (this.isTrnxLimitExceeded == false) {
        this.executeManual(receivedData);
      } else {
        this.createNotification(
          'error',
          'Input Error',
          'Transaction Limit Exceeded',
          '#ffffff',
          '#cc2d2d'
        );
      }
    }
  }
  onselectexecuteManual(receivedData: any) {
    const data: any = {};
    data['transactionMasterId'] = receivedData.transactionMasterId;
    data['transactionDetailId'] = receivedData.transactionDetailId;
    data['isManual'] = true;
    this.transferService.executionTypemanual(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          res['responseDto']['message'],
          '#ffffff',
          '#00A03E'
        );
      } else {
        this.createNotification(
          'error',
          'Input Error',
          'LCR service quote creation Failed',
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  checkTransferLimitation(id: any) {
    const data: any = {};
    data['agentTransactionMasterId'] = id.transactionMasterId;
    this.transferService.checkTransferLimitation(data).subscribe((res: any) => {
      if (res['responseDto']['isLimitExceeded'] == true) {
        this.createNotification(
          'error',
          'Input Error',
          'Transaction Limit Exceeded',
          '#ffffff',
          '#cc2d2d'
        );
        this.isTrnxLimitExceeded = true;
      }
    });
  }
  executeManual(receivedData: any) {
    const data: any = {};
    data['transactionMasterId'] = receivedData.transactionMasterId;
    data['transactionDetailId'] = receivedData.transactionDetailId;
    data['transactionType'] = this.type
      ? this.type
      : receivedData.executionType;
    this.transferService.executeQuote(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'Executed successfully',
          '#ffffff',
          '#00A03E'
        );
        this.eventTrigger.onReloadServiceData('amount');
      } else {
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  executeTarraPay(receivedData: any) {
    const data: any = {};
    data['transactionMasterId'] = receivedData.transactionMasterId;
    data['transactionDetailId'] = receivedData.transactionDetailId;
    data['isManual'] = false;
    this.transferService.executionTypeTerrapay(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          res['responseDto']['message'],
          '#ffffff',
          '#00A03E'
        );
      } else {
        this.createNotification(
          'error',
          'Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  executeCargills(receivedData: any) {
    const data: any = {};
    data['transactionMasterId'] = receivedData.transactionMasterId;
    data['transactionDetailId'] = receivedData.transactionDetailId;
    data['isManual'] = false;
    this.transferService.executionTypeCargills(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          res['responseDto']['message'],
          '#ffffff',
          '#00A03E'
        );
      } else {
        this.createNotification(
          'error',
          'Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  formatCurrency(currency: string): string {
    const currencyCode = currency.substring(currency.length - 3);
    const amount = parseFloat(currency.substring(0, currency.length - 4));
    return currencyCode + ' ' + amount.toFixed(2);
  }

  showModal(id: any): void {
    this.isVisible = true;
    this.declinedTrnxId = id;
  }

  handleOk(): void {
    this.declineTrnx(this.declinedTrnxId);
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
