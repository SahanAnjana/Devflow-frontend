import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from 'src/app/_services/agent.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';

@Component({
  selector: 'app-currency-amount-validation',
  templateUrl: './currency-amount-validation.component.html',
  styleUrls: ['./currency-amount-validation.component.sass'],
})
export class CurrencyAmountValidationComponent {
  tableData: any = [];
  pageSize: any = 5;
  pageNumber: any = 1;
  totalRecords: any;
  currentPageIndex = 1;
  exposableId: any;

  currency_data: any;
  sendingCurrency_data: any;
  receivingCurrency_data: any;
  paymentMode_data: any;
  currentIndex = 1;
  destroy$: Subject<boolean> = new Subject<boolean>();

  modalRef: any;
  currencyAmountValidationForm!: FormGroup;
  agentData: any;
  constructor(
    private modalService: NzModalService,
    private router: Router,
    private subAgentSetting: SubAgentSettingsService,
    private metaService: MetaService,
    private dataService: DataService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private agentService: AgentService,
    private eventTrigger: EventtriggerService
  ) {}

  ngOnInit() {
    this.agentData = this.dataService.selectedData;
    this.currencyAmountValidationForm = this.fb.group({
      agentName: [this.agentData?.agentName, Validators.required],
      sendingCurrency: [null, Validators.required],
      receipientCurrency: [null, Validators.required],
      paymentMode: [null, Validators.required],
      minimumSendAmount: [null, Validators.required],
      maximumSendAmount: [null, Validators.required],
      minimumReceivedAmount: [null, Validators.required],
      maximumReceivedAmount: [null, Validators.required],
    });
    this.agentName?.disable();

    this.getAllSendingCurrency();
    this.getAllReceivingCurrency();
    this.getAllPaymentMode();
    this.getAllCurrencyAmountValidation();
    this.eventTrigger.executeOnchangeFunction.subscribe((res) => {
      if (res === 'transaction') {
        this.getAllPaymentMode();
      }
    });
  }
  get agentName() {
    return this.currencyAmountValidationForm.get('agentName');
  }
  get sendingCurrency() {
    return this.currencyAmountValidationForm.get('sendingCurrency');
  }
  get receipientCurrency() {
    return this.currencyAmountValidationForm.get('receipientCurrency');
  }
  get paymentMode() {
    return this.currencyAmountValidationForm.get('paymentMode');
  }
  get minimumSendAmount() {
    return this.currencyAmountValidationForm.get('minimumSendAmount');
  }
  get maximumSendAmount() {
    return this.currencyAmountValidationForm.get('maximumSendAmount');
  }
  get minimumReceivedAmount() {
    return this.currencyAmountValidationForm.get('minimumReceivedAmount');
  }
  get maximumReceivedAmount() {
    return this.currencyAmountValidationForm.get('maximumReceivedAmount');
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'AgentName': {
        return 'Agent Name';
      }
      case 'sendingCurrency': {
        return 'Sending Currency';
      }
      case 'receipientCurrency': {
        return 'Recipient Currency';
      }
      case 'paymentMode': {
        return 'Payment Mode';
      }
      case 'minimumSendAmount': {
        return 'Minimum Send Amount';
      }
      case 'maximumSendAmount': {
        return 'Maximum Send Amount';
      }
      case 'MaximumSellingRate': {
        return 'Maximum Selling Rate';
      }
      case 'minimumReceivedAmount': {
        return 'Minimum Received Amount';
      }
      case 'maximumReceivedAmount': {
        return 'Maximum Received Amount';
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
  getAllCurrencyAmountValidation() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.subAgentSetting
      .getAllcurrencyAmountValidation(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableData = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.tableData = [];
            this.totalRecords = 0;
          }
        },
        error: (e: any) => {
          this.tableData = [];
        },
      });
  }

  getAllSendingCurrency() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;
    this.subAgentSetting
      .getAllSubAgentSendingCurrency(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.sendingCurrency_data = res['responseDto'];
        },
      });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllCurrencyAmountValidation();
  }
  getAllReceivingCurrency() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;

    this.subAgentSetting
      .getAllSubAgentReceivingCurrency(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.receivingCurrency_data = res['responseDto'];
        },
      });
  }

  getAllPaymentMode() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;

    this.subAgentSetting
      .getAllSubAgentPaymentMode(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.paymentMode_data = res['responseDto'];
        },
      });
  }

  closeCurrency() {
    this.currencyAmountValidationForm.reset();
    this.currencyAmountValidationForm.patchValue({
      agentName: this.agentData?.agentName,
    });
  }
  saveCurrency() {
    if (!this.currencyAmountValidationForm.valid) {
      this.validateAllFormFields(this.currencyAmountValidationForm);
      return;
    } else {
      const data = {
        minSendingAmount: this.minimumSendAmount?.value,
        maxSendingAmount: this.maximumSendAmount?.value,
        minReceivingAmount: this.minimumReceivedAmount?.value,
        maxReceivingAmount: this.maximumReceivedAmount?.value,
        isActive: true,
        agentTransferApprovedSendingCurrenciesDto: {
          agentTransferApprovedSendingCurrenciesId: this.sendingCurrency?.value,
        },
        agentTransferApprovedReceivingCurrenciesDto: {
          agentTransferApprovedReceivingCurrenciesId:
            this.receipientCurrency?.value,
        },
        agentPaymentModeDto: {
          agentPaymentModeId: this.paymentMode?.value,
        },
      };
      this.agentService.saveSendingRecievingValidation(data).subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'Saved successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.eventTrigger.onReloadServiceData('currencyValidation');
            this.closeCurrency();
            this.getAllCurrencyAmountValidation();
          } else {
            this.eventTrigger.onReloadServiceData('currencyValidation');
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
}
