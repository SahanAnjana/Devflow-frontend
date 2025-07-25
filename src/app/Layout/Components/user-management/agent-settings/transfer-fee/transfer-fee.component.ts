import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from 'src/app/_services/agent.service';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-transfer-fee',
  templateUrl: './transfer-fee.component.html',
  styleUrls: ['./transfer-fee.component.sass'],
})
export class TransferFeeComponent implements OnInit {
  pageNumber = 1;
  pageSize = 10;
  currentIndex = 1;

  totalRecords: any;
  tableData: any[] = [];
  agentData: any;
  currencyList: any[] = [];
  recievingCurrencyList: any[] = [];
  transferModes: any[] = [];
  paymentModes: any[] = [];
  transferFeeData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectSendingCurrencyValues: any;
  selectSendingCurrencyValuesId: any;
  selectReceivingCurrencyValues: any;
  selectTransferValues: any;
  selectPaymentModeValues: any;
  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private dataService: DataService,
    private fb: FormBuilder,
    private makeTransferService: MakeTransferService,
    private metaService: MetaService,
    private notificationService: NzNotificationService,
    private agentService: AgentService
  ) {}
  transferFeeform!: FormGroup;

  ngOnInit(): void {
    this.agentData = this.dataService.selectedData;
    this.transferFeeform = this.fb.group({
      agentName: [this.agentData?.agentName],
      sendingCurrency: [null, Validators.required],
      receivingCurrency: [null, Validators.required],
      transferMode: [null, Validators.required],
      transferFeeType: [null, Validators.required],
      paymentMode: [null, Validators.required],
      startAmount: [null, Validators.required],
      endAmount: [null, Validators.required],
      fee: [null, Validators.required],
    });
    this.agentName?.disable();
    this.getAgentSendingCurrencies();
    this.getAllPaymentModes();
    this.getAllTransactionFee();

    this.transferFeeform
      .get('sendingCurrency')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedSendingCurrencyCode: any) => {
        const selectSendingCurrency = this.currencyList.find(
          (currency: any) =>
            currency.currencyCode === selectedSendingCurrencyCode
        );
        if (selectSendingCurrency) {
          this.selectSendingCurrencyValues = selectSendingCurrency.currencyCode;
          this.selectSendingCurrencyValuesId =
            selectSendingCurrency.agentTransferApprovedSendingCurrenciesId;
        }
        this.getReceivingCurrencies(this.selectSendingCurrencyValues);
      });

    this.transferFeeform
      .get('receivingCurrency')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedReceivingCurrencyCode: any) => {
        console.log('hgfghg', this.recievingCurrencyList);
        const selectReceivingCurrency = this.recievingCurrencyList.find(
          (currency: any) =>
            currency.currencyCode === selectedReceivingCurrencyCode
        );
        console.log('revdc', selectReceivingCurrency);
        if (selectReceivingCurrency) {
          this.selectReceivingCurrencyValues =
            selectReceivingCurrency.agentTransferApprovedSendingReceivingCurrenciesId;
        }
        this.getTransferMode(this.selectReceivingCurrencyValues);
        console.log('hgfghg', this.selectReceivingCurrencyValues);
      });

    this.transferFeeform
      .get('transferMode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedTransferMode: any) => {
        const selectTransfer = this.transferModes.find(
          (transfer: any) =>
            transfer.transactionModeDesc === selectedTransferMode
        );
        if (selectTransfer) {
          this.selectTransferValues =
            selectTransfer.agentCurrencyTransactionModeId;
        }
      });

    this.transferFeeform
      .get('paymentMode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedpaymendMode: any) => {
        const selectPayment = this.paymentModes.find(
          (payment: any) =>
            payment.paymentModeDto.paymentModeDesc === selectedpaymendMode
        );
        if (selectPayment) {
          this.selectPaymentModeValues = selectPayment.agentPaymentModeId;
        }
      });
  }
  get agentName() {
    return this.transferFeeform.get('agentName');
  }
  get receivingCurrency() {
    return this.transferFeeform.get('receivingCurrency');
  }
  get sendingCurrency() {
    return this.transferFeeform.get('sendingCurrency');
  }
  get transferMode() {
    return this.transferFeeform.get('transferMode');
  }
  get transferFeeType() {
    return this.transferFeeform.get('transferFeeType');
  }
  get paymentMode() {
    return this.transferFeeform.get('paymentMode');
  }
  get fee() {
    return this.transferFeeform.get('fee');
  }
  get startAmount() {
    return this.transferFeeform.get('startAmount');
  }
  get endAmount() {
    return this.transferFeeform.get('endAmount');
  }
  getAgentSendingCurrencies() {
    const data = {
      exposableId: this.dataService.selectedData.exposableId,
    };
    this.makeTransferService.getAgentSendingCurrency(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.currencyList = res['responseDto'];
        }
      },
    });
  }
  getAllPaymentModes() {
    const data = {
      exposableId: this.dataService.selectedData.exposableId,
    };
    this.makeTransferService.getAgentPaymentMode(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.paymentModes = res['responseDto'];
        }
      },
    });
  }

  getReceivingCurrencies(data: any) {
    this.metaService
      .getAllAgentReceivingCurrenciesByCurrencyCode(
        this.dataService.selectedData.exposableId,
        data
      )
      .subscribe({
        next: (res: any) => {
          this.recievingCurrencyList = res['responseDto'];
          if (res['responseDto']) {
            this.recievingCurrencyList = res['responseDto'];
          }
        },
      });
  }
  getTransferMode(data: any = null) {
    console.log(data);

    this.metaService
      .getAllAgentTransferModeByCurrencyCode(
        this.dataService.selectedData.exposableId,
        data
      )
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.transferModes = res['responseDto'];
          }
        },
      });
  }
  onUpdate() {
    if (this.transferFeeData == null) {
      this.onSubmit();
    } else {
      this.updateTransferFee();
    }
  }

  onSubmit() {
    if (!this.transferFeeform.valid) {
      this.validateAllFormFields(this.transferFeeform);
      return;
    } else {
      const data = {
        subAgentName: this.agentName?.value,
        sendingCurrencyId: this.selectSendingCurrencyValuesId,
        receivingCurrencyId: this.selectReceivingCurrencyValues,
        transferModeId: this.selectTransferValues,
        paymentModeId: this.selectPaymentModeValues,
        transferFeeType: this.transferFeeType?.value,
        startAmount: this.startAmount?.value,
        endAmount: this.endAmount?.value,
        fee: this.fee?.value,
      };
      this.agentService.saveAgentTransactionFee(data).subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'Transaction Fee added successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.closeFee();
            this.getAllTransactionFee();
          } else {
            this.notificationService.create(
              'error',
              'Error',
              res['errorDescription'],
              { nzStyle: { background: '#cc2d2d' } }
            );
          }
        },
      });
    }
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'agentName': {
        return 'Agent Name';
      }
      case 'sendingCurrency': {
        return 'Sending Currency';
      }
      case 'receivingCurrency': {
        return 'Receiving Currency';
      }
      case 'transferMode': {
        return 'Transfer Mode';
      }
      case 'transferFeeType': {
        return 'Transfer Fee Type';
      }
      case 'paymentMode': {
        return 'Payment Mode';
      }
      case 'startAmount': {
        return 'Start Amount';
      }
      case 'endAmount': {
        return 'End Amount';
      }
      case 'fee': {
        return 'Fee';
      }
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
          control.markAsDirty();
          control.updateValueAndValidity();
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        } else {
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  closeFee() {
    this.transferFeeform.reset();
    this.transferFeeform.patchValue({
      agentName: this.agentData?.agentName,
    });
    this.transferFeeform.enable();
  }

  getAllTransactionFee() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['exposableId'] = this.agentData.exposableId;

    this.agentService.getAllagentTransactionFee(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.totalRecords = res['responseDto']['totalRecords'];
          this.tableData = res['responseDto']['payload'];
        } else {
          this.totalRecords = 0;
          this.tableData = [];
        }
      },
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllTransactionFee();
  }

  edit(receivedData: any) {
    this.transferFeeform.disable();
    this.fee?.enable();
    this.transferFeeData = receivedData;
    console.log(receivedData);

    this.transferFeeform.patchValue({
      sendingCurrency: receivedData.sendingCurrency,
      receivingCurrency: receivedData.receivingCurrecny,
      transferMode: receivedData.agentCurrencyTransactionMode,
      transferFeeType: receivedData.transferFeeType,
      paymentMode: receivedData.paymentMode,
      startAmount: receivedData.startAmount,
      endAmount: receivedData.endAmount,
      fee: receivedData.fee,
    });
  }
  updateTransferFee() {
    console.log(this.transferFeeData);

    if (!this.transferFeeform.valid) {
      return this.validateAllFormFields(this.transferFeeform);
    }
    const data: any = {};
    data['agentConfiguredTransferFeeId'] =
      this.transferFeeData.agentConfiguredtrasferFeeId;
    const formdata: any = {
      // transferFeeType: this.transferFeeType?.value,
      // startAmount: this.startAmount?.value,
      // endAmount: this.endAmount?.value,
      fee: this.fee?.value,
      // agentTransferApprovedSendingCurrenciesDto: {
      //   agentTransferApprovedSendingCurrenciesId:
      //     this.selectSendingCurrencyValuesId,
      // },
      // agentCurrencyTransactionModeDto: {
      //   agentCurrencyTransactionModeId: this.selectTransferValues,
      // },
      // agentPaymentModeDto: {
      //   agentPaymentModeId: this.selectPaymentModeValues,
      // },
    };
    this.agentService.updateTransferFee(formdata, data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Transaction Fee added successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.transferFeeData = null;
          this.closeFee();
          this.getAllTransactionFee();
        } else {
          this.notificationService.create(
            'error',
            'Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d' } }
          );
        }
      },
    });
  }
  // enableFields() {
  //   this.sendingCurrency?.enable;
  //   this.receivingCurrency?.enable;
  //   this.transferMode?.enable;
  //   this.transferFeeType?.enable;
  //   this.paymentMode?.enable;
  //   this.startAmount?.enable;
  //   this.endAmount?.enable;
  // }
  // disableFields() {
  //   this.sendingCurrency?.disable;
  //   this.receivingCurrency?.disable;
  //   this.transferMode?.disable;
  //   this.transferFeeType?.disable;
  //   this.paymentMode?.disable;
  //   this.startAmount?.disable;
  //   this.endAmount?.disable;
  // }
}
