import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DecimalPipe, formatNumber } from '@angular/common';

@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.sass'],
})
export class TransferDetailsComponent {
  privileges: any = {
    CORE_SHOW_MAKE_TRANSFER_TRANSFER_FEE_EDIT: false,
  };
  @Input() formGroupName!: string;
  @Input() allAgents: any[] = [];
  @Input() affiliateAgents: any[] = [];
  @Input() subAgents: any[] = [];
  @Input() agentReceivingCurrency: any[] = [];
  @Input() transactionMode: any[] = [];
  @Input() agentSendingCurrency: any[] = [];

  @Input() sendingCurrencyCode: any;
  @Input() exposableId: any;
  @Input() paymentModedata: any;
  maketransferForm!: FormGroup;
  @Output() agentChange: EventEmitter<any> = new EventEmitter();
  @Output() SendingCurrencyChange: EventEmitter<any> = new EventEmitter();
  @Output() receivingCurrencyChange: EventEmitter<any> = new EventEmitter();
  @Output() FirstIndexvalue: EventEmitter<any> = new EventEmitter();
  @Output() clearBEnifisaryDetails: EventEmitter<any> = new EventEmitter();
  @Input() receivingCurrencyId: any;

  emitAgentChange(agent: any) {
    this.agentChange.emit(agent);
    this.eventTriggerService.onReloadServiceData('clearForms');
    this.dataService.senderData = null;
  }
  changereceivingCurrency(recCcy: any) {
    this.SendingCurrencyChange.emit(recCcy);
    this.dataService.sendingCurrencyData = recCcy;
    this.sendingCurrencyCode = recCcy.clientCurrencyId;
    this.sendingAmount?.setValue('');
    this.receivingAmount?.setValue('');
    this.finalValidation();
  }
  getAgentTransactionMode(trnxMode: any) {
    this.dataService.receivingCurrencyIdForBank = trnxMode.currencyId;
    this.receivingCurrencyChange.emit(trnxMode);
    this.receivingCurrencyId = trnxMode.currencyId;
    this.sendingAmount?.setValue('');
    this.receivingAmount?.setValue('');
    this.finalValidation();
  }
  destroy$: Subject<boolean> = new Subject<boolean>();
  public makeTransfrFlow1!: FormGroup;
  sendingAmountData: any;
  sendingAmountc: any;
  receivingAmountData: any;
  transferFeeData: any;
  private searchNameData = new Subject<any>();
  senderDetailsResult: any;
  nameVal: any;
  data$: any;
  agentId: any;
  currentUser: any;
  searchResult: any;
  agentEmail: any;
  validationData: any;
  allPrivilages: any;

  constructor(
    private transferService: MakeTransferService,
    private dataService: DataService,
    private rootFormGroup: FormGroupDirective,
    private eventTriggerService: EventtriggerService,
    private reportService: ReportService,
    private notificationService: NzNotificationService,
    private decimalPipe: DecimalPipe,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.dataService.selectedBank = null;
    this.maketransferForm = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;
    this.rate?.disable();

    this.totalAmount?.disable();
    this.searchSubscripe();
    // if (this.validationData == true) {
    //   this.finalValidation();
    // }
    // console.log('snd', this.dataService.senderData);
    this.covertSendingToDecimal();
    this.covertReceivingToDecimal();
    this.eventTriggerService.onReloadServiceData('privilages');
    this.callPrivilageApi();

    this.maketransferForm.patchValue({
      senderSearch: this.dataService.saveSearchNameValue,
    });
    this.onSelectedSender(this.dataService.senderData);
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_MAKE_TRANSFER_TRANSFER_FEE_EDIT') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_MAKE_TRANSFER_TRANSFER_FEE_EDIT = true)
          : false;
        if (!this.privileges.CORE_SHOW_MAKE_TRANSFER_TRANSFER_FEE_EDIT) {
          this.transactionFee?.disable();
        }
      }
    });
  }

  changeTotalPayable(value: any) {
    let inputValue = value.target.value.replace(/,/g, '');
    let newInputValue = parseFloat(inputValue.replace(/,/g, '')).toFixed(2);
    let sendingAmountValue = parseFloat(
      this.sendingAmount?.value.replace(/,/g, '')
    ).toFixed(2);

    // Parse newInputValue and sendingAmountValue as floats and add them
    let totalPayableValue =
      parseFloat(newInputValue) + parseFloat(sendingAmountValue);

    // Format the total payable value to two decimal places
    let formattedTotalPayableValue = totalPayableValue
      .toFixed(2)
      .replace(/,/g, '');

    console.log('Total payable value', newInputValue);
    console.log('Sending amount value', sendingAmountValue.replace(/,/g, ''));
    console.log(
      'Total payable value total',
      formattedTotalPayableValue.replace(/,/g, '')
    );

    // this.totalAmount?.enable();
    this.maketransferForm.get('totalAmount')?.reset();

    this.maketransferForm.patchValue({
      totalAmount: formattedTotalPayableValue,
    });
  }

  // ---- transferDetailsForm (step 01) ----
  get agentName() {
    return this.maketransferForm.get('agentName');
  }
  get subAgentName() {
    return this.maketransferForm.get('subAgentName');
  }
  get affiliateName() {
    return this.maketransferForm.get('affiliateName');
  }
  get sendingCurrency() {
    return this.maketransferForm.get('sendingCurrency');
  }
  get recipientCurrency() {
    return this.maketransferForm.get('recipientCurrency');
  }
  get sendingAmount() {
    return this.maketransferForm.get('sendingAmount');
  }
  get receivingAmount() {
    return this.maketransferForm.get('receivingAmount');
  }
  get transferMode() {
    return this.maketransferForm.get('transferMode');
  }
  get rate() {
    return this.maketransferForm.get('rate');
  }
  get paymentMode() {
    return this.maketransferForm.get('paymentMode');
  }
  get transferFeeMethod() {
    return this.maketransferForm.get('transferFeeMethod');
  }
  get transactionFee() {
    return this.maketransferForm.get('transactionFee');
  }
  get totalAmount() {
    return this.maketransferForm.get('totalAmount');
  }
  get senderSearch() {
    return this.maketransferForm.get('senderSearch');
  }
  get senderSearchTypeInFirst() {
    return this.maketransferForm.get('senderSearchType');
  }

  calculateSendingAmount(amount: any) {
    this.dataService.sendingAmount = amount;
    // this.getSendingAmount();
    this.transferMode?.setValue(null);
    this.paymentMode?.setValue(null);
  }
  calculateReceivingAmount(amount: any) {
    this.dataService.receivingAmount = amount;
    // this.getSendingAmount();
    this.transferMode?.setValue(null);
    this.paymentMode?.setValue(null);
  }
  getSendingAmount() {
    this.maketransferForm.get('totalAmount')?.reset();
    this.maketransferForm.get('transactionFee')?.reset();
    const data: any = {};
    data['sendingCurrencyId'] = this.sendingCurrencyCode;
    data['receivingCurrencyId'] = this.recipientCurrency?.value.currencyId;
    data['amount'] = parseFloat(this.receivingAmount?.value.replace(/,/g, ''));
    data['providerType'] = 'MONEX';
    data['exposableId'] = this.exposableId;
    data['email'] = this.dataService.senderData
      ? this.dataService.senderData.email
      : null;
    this.transferService
      .getAgentCurrencyRateSendAmount(data)
      .subscribe((res) => {
        if (res['responseDto']) {
          if (res['responseDto']['sendingAmount'] < 10) {
            this.notificationService.create(
              'error',
              'Error',
              'Minimum sending amount is 10.00',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
            this.maketransferForm.patchValue({
              sendingAmount: '',
            });
          } else {
            if (
              res['responseDto']['sendingAmount'] ==
              data.amount / res['responseDto']['rate']
            ) {
              this.dataService.rate = res['responseDto']['rate'];
              this.sendingAmountData = res['responseDto'];
              this.dataService.agentCurrencyRateId =
                res['responseDto']['currencyRateId'];

              this.dataService.isSendingAmount = false;
              this.maketransferForm.patchValue({
                sendingAmount:
                  this.sendingAmountData.sendingAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                rate: this.sendingAmountData.rate.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                }),
              });
            }
          }
        } else {
          this.sendingAmountData = '';
          this.createNotification(
            'error',
            'Input Error',
            res['errorDescription'],
            '#ffffff',
            '#cc2d2d'
          );
        }
        // this.getTransferFeedetails();
      });
  }
  // calculateReceivingAmount() {
  //   this.getReceivingAmount();
  // }
  getReceivingAmount() {
    this.maketransferForm.get('totalAmount')?.reset();
    this.maketransferForm.get('transactionFee')?.reset();
    if (this.sendingAmount?.value < 10) {
      this.notificationService.create(
        'error',
        'Error',
        'Minimum sending amount is 10.00',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
      this.maketransferForm.patchValue({
        receivingAmount: '',
      });
    } else {
      const data: any = {};
      data['sendingCurrencyId'] = this.sendingCurrencyCode;
      data['receivingCurrencyId'] = this.recipientCurrency?.value.currencyId;
      data['amount'] = parseFloat(this.sendingAmount?.value.replace(/,/g, ''));
      data['providerType'] = 'MONEX';
      data['exposableId'] = this.exposableId;
      data['email'] = this.dataService.senderData
        ? this.dataService.senderData.email
        : null;
      this.transferService
        .getAgentCurrencyRateReceivedAmount(data)
        .subscribe((res) => {
          if (res['responseDto']) {
            if (
              res['responseDto']['receivingAmount'] ==
              data.amount * res['responseDto']['rate']
            ) {
              this.dataService.rate = res['responseDto']['rate'];
              this.receivingAmountData = res['responseDto'];
              this.dataService.agentCurrencyRateId =
                res['responseDto']['currencyRateId'];

              this.dataService.isSendingAmount = true;
              this.maketransferForm.patchValue({
                receivingAmount:
                  this.receivingAmountData.receivingAmount.toLocaleString(
                    'en-US',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ),
                rate: this.receivingAmountData.rate.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                }),
              });
            } else {
              this.createNotification(
                'error',
                'Input Error',
                'Invalid Amount',
                '#ffffff',
                '#cc2d2d'
              );
            }
          } else {
            this.receivingAmountData = '';
            this.createNotification(
              'error',
              'Input Error',
              res['errorDescription'],
              '#ffffff',
              '#cc2d2d'
            );
          }
          // this.getTransferFeedetails();
          // console.log(this.receivingAmountData.receivedAmount);
        });
    }
  }

  getTransferFeedetails() {
    if (this.transferMode?.value != null && this.paymentMode?.value != null) {
      const data: any = {};
      data['agentTransferApprovedSendingCurrenciesId'] =
        this.sendingCurrency?.value.agentTransferApprovedSendingCurrenciesId;
      data['agentCurrencyTransactionModeId'] =
        this.transferMode?.value.agentCurrencyTransactionModeId;
      data['agentPaymentModeId'] = this.paymentMode?.value;
      data['amount'] = this.sendingAmount?.value
        ? parseFloat(this.sendingAmount?.value.replace(/,/g, ''))
        : parseFloat(this.receivingAmount?.value.replace(/,/g, ''));
      this.transferService.getTransferFee(data).subscribe((res) => {
        if (res['responseDto']) {
          if (
            res['responseDto']['totalPayable'] ==
            data.amount + res['responseDto']['fee']
          ) {
            this.transferFeeData = res['responseDto'];
            this.finalValidation();
            this.maketransferForm.patchValue({
              totalAmount: this.transferFeeData.totalPayable.toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              ),
              transactionFee: this.transferFeeData.fee.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            });
            this.finalValidation();
          } else {
            this.createNotification(
              'error',
              'Input Error',
              'Invalid Amount',
              '#ffffff',
              '#cc2d2d'
            );
          }
        } else {
          this.transferFeeData = '';
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
  }

  onChangeTransferMode(data: any) {
    this.dataService.transferAs = data;
    this.getTransferFeedetails();

    // this.getSendingAmount();
  }
  onChangePaymentferMode() {
    this.getTransferFeedetails();
    // this.getReceivingAmount();
    // this.getSendingAmount();
  }
  calculateRecAmt() {
    this.getReceivingAmount();
  }
  calculateSendingAmt() {
    this.getSendingAmount();
  }
  searchSubscripe() {
    this.data$ = this.searchNameData
      .pipe(
        takeUntil(this.destroy$),
        // wait 300ms after each keystroke before considering the term
        debounceTime(500),
        // ignore new term if same as previous term
        distinctUntilChanged(),
        // ignore new term if fewer than 3 characters
        filter((term: string) => term.length >= 3),
        // switch to new search observable each time the term changes
        switchMap(async () => this.getAgentSenderSearch())
      )
      .subscribe((res: any) => {});
  }

  onSelectedSender(data: any) {
    this.dataService.senderData = data;
    // console.log(data);
    this.maketransferForm.get('sendingAmount')?.reset();
    this.maketransferForm.get('receivingAmount')?.reset();
    this.eventTriggerService.onReloadServiceData('senderChanged');
  }
  searchrxjs($event: any) {
    const value = $event;
    value ? this.searchNameData.next(value) : '';
    this.nameVal = value;
    this.dataService.saveSearchNameValue = value;
    console.log('saveSearchNameValue', this.dataService.saveSearchNameValue);
    if (value === '') {
      this.eventTriggerService.onReloadServiceData();
      this.dataService.saveSearchNameValue = '';
    }
  }

  getAgentSenderSearch() {
    const data: any = {};
    data['name'] = this.nameVal;
    data['email'] = this.dataService.agentEmail;
    data['agentDetailId'] = this.dataService.agentId;
    this.transferService.getAgentSender(data).subscribe((res) => {
      if (res['responseDto']) {
        this.searchResult = res['responseDto'];
      } else {
        this.searchResult = '';
      }
    });
  }
  covertSendingToDecimal() {
    this.sendingAmount?.setValue(
      this.decimalPipe.transform(this.sendingAmount.value, '.2-2')
    );
  }
  covertReceivingToDecimal() {
    this.receivingAmount?.setValue(
      this.decimalPipe.transform(this.receivingAmount.value, '.2-2')
    );
  }
  finalValidation() {
    const data: any = {};
    data['agentTransferApprovedSendingCurrenciesId'] =
      this.sendingCurrency?.value?.agentTransferApprovedSendingCurrenciesId;
    data['agentTransferApprovedReceivingCurrenciesId'] =
      this.recipientCurrency?.value?.agentTransferRecceviingCurrenciesIDss;
    data['agentPaymentModeId'] = this.paymentMode?.value;
    data['sendingAmount'] = parseFloat(
      this.sendingAmount?.value.replace(/,/g, '')
    );
    data['receivedAmount'] = parseFloat(
      this.receivingAmount?.value.replace(/,/g, '')
    );
    return this.transferService
      .getSendingReceivingAmountValidation(data)
      .subscribe((res) => {
        if (res['responseDto']) {
          this.validationData = res['responseDto']['validateResult'];
          this.dataService.validationResult =
            res['responseDto']['validateResult'];
          this.dataService.validationData =
            res['responseDto']['validateResult'];
          if (this.validationData == false) {
            this.createNotification(
              'error',
              'Input Error',
              'Max Receiving Amount is ' +
                res['responseDto']['maxReceivingAmount'],
              '#ffffff',
              '#cc2d2d'
            );
            this.createNotification(
              'error',
              'Input Error',
              'Max Sending Amount is ' + res['responseDto']['maxSendingAmount'],
              '#ffffff',
              '#cc2d2d'
            );
            this.createNotification(
              'error',
              'Input Error',
              'Min Receiving Amount is ' +
                res['responseDto']['minReceivingAmount'],
              '#ffffff',
              '#cc2d2d'
            );
            this.createNotification(
              'error',
              'Input Error',
              'Min Sending Amount is ' + res['responseDto']['minSendingAmount'],
              '#ffffff',
              '#cc2d2d'
            );
          }
        } else if (!res['responseDto']) {
          this.dataService.validationData == '';
        }
      });
  }

  getFormcontrolValue() {
    return this.maketransferForm.value;
  }
  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
  validateNumber() {
    let inputType = this.maketransferForm.get('sendingAmount')?.value;

    if (inputType !== null) {
      inputType = inputType.replace(/,/g, '').replace(/\./g, '');
      if (/\D/.test(inputType)) {
        // Notify user about invalid input
        this.createNotification(
          'error',
          'Input Error',
          'Amount must contain only numbers.',
          '#ffffff',
          '#cc2d2d'
        );
        return; // Exit validation
      }
    }
  }
  validateNumberRec() {
    let inputType = this.maketransferForm.get('receivingAmount')?.value;
    if (inputType !== null) {
      inputType = inputType.replace(/,/g, '')?.replace(/\./g, '');
      if (/\D/.test(inputType)) {
        // Notify user about invalid input
        this.createNotification(
          'error',
          'Input Error',
          'Amount must contain only numbers.',
          '#ffffff',
          '#cc2d2d'
        );
        return; // Exit validation
      }
    }
  }
  // validateNumericInput(event: any) {
  //   const input = event.target;
  //   const regex = /^[\d,.]*$/; // Regular expression to allow digits, commas, and decimal points
  //   if (!regex.test(input.value)) {
  //     input.value = input.value.replace(/[^\d,.]/g, ''); // Remove any non-numeric characters except commas and decimal points
  //   }
  // }

  checkRatesValidOrNot() {
    const data: any = {};
    data['receivingAmount'] = parseFloat(
      this.maketransferForm.get('receivingAmount')!.value.replace(/,/g, '')
    );
    data['sendingAmount'] = parseFloat(
      this.maketransferForm.get('sendingAmount')!.value.replace(/,/g, '')
    );
    (data['totalPayable'] = parseFloat(
      this.maketransferForm.get('totalAmount')!.value.replace(/,/g, '')
    )),
      (data['fee'] = parseFloat(
        this.maketransferForm.get('transactionFee')!.value.replace(/,/g, '')
      )),
      (data['currencyRate'] = parseFloat(
        this.maketransferForm.get('rate')!.value.replace(/,/g, '')
      ));
    data['isSendingAmount'] = this.dataService.isSendingAmount;

    this.transferService.checkRatesvalidOrNot(data).subscribe((res: any) => {
      if (res['responseDto']) {
        if (res['responseDto']['status'] == false) {
          this.FirstIndexvalue.emit(1);
          this.notificationService.create(
            'error',
            'error',
            res['responseDto']['errorDescription'],
            {
              nzStyle: { background: '#cc2d2d', color: '#ffff' },
            }
          );
        } else {
          this.FirstIndexvalue.emit(2);
          this.dataService.totalamount = parseFloat(
            this.maketransferForm.get('totalAmount')!.value.replace(/,/g, '')
          );
          // this.notificationService.create(
          //   'success',
          //   'Success',
          //   res['responseDto'],
          //   {
          //     nzStyle: { background: '#00A03E', color: '#ffff' },
          //   }
          // );
        }
      } else {
        this.FirstIndexvalue.emit(1);
        this.notificationService.create(
          'error',
          'Error',
          'Incorrect calculations',
          {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          }
        );
      }
    });
  }
}
