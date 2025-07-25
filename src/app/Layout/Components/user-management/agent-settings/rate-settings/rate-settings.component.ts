import { Component } from '@angular/core';
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
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';
// import { DataService } from 'src/app/_services/shared-data/data.service';
@Component({
  selector: 'app-rate-settings',
  templateUrl: './rate-settings.component.html',
  styleUrls: ['./rate-settings.component.sass'],
})
export class RateSettingsComponent {
  pageNumber = 1;
  pageSize = 10;
  currentIndex = 1;
  currencyId: any;
  providerType: any;
  agentCurrencyRateId: any;

  totalRecords = 0;

  isCoporate = '';
  switchValue = false;

  currency_data: any;
  provider_data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  agentData: any;
  tableData: any = [];

  existingAgentCustomers: any[] = [];
  agentApprovedCurrencyRateId: any;
  newAgentCurrencyId: any;
  rateData: any;

  constructor(
    private modalService: NzModalService,
    private fb: FormBuilder,
    private modalref: NzModalRef,
    private subAentSetting: SubAgentSettingsService,
    private agentService: AgentService,
    private notificationService: NzNotificationService,
    private eventTrigger: EventtriggerService,
    private dataService: DataService // private dataService: DataService
  ) {}

  ratesettingform!: FormGroup;
  ngOnInit() {
    this.agentData = this.dataService.selectedData;
    console.log('reteSettingAgerntNAmeBasecurrency', this.agentData);

    this.ratesettingform = this.fb.group({
      AgentName: [this.agentData?.agentName, Validators.required],
      currencyType: [null, Validators.required],
      agentBaseCurrency: [this.agentData?.baseCurrency, Validators.required],
      ProviderType: [null, Validators.required],
      BuyingRate: [null, Validators.required],
      SellingRate: [null, Validators.required],

      MaximumBuyingRate: [null, Validators.required],
      MinimumBuyingRate: [null, Validators.required],
      MaximumSellingRate: [null, Validators.required],
      MinimumSellingRate: [null, Validators.required],
    });
    this.AgentName?.disable();
    this.agentBaseCurrency?.disable();
    this.getAllCurrency();
    // this.getAllProvider();
    this.getAllCurrencyRate();
    this.eventTrigger.executeOnchangeFunction.subscribe((res) => {
      if (res === 'currency') {
        this.getAllCurrency();
      }
    });
  }
  get AgentName() {
    return this.ratesettingform.get('AgentName');
  }
  get currencyType() {
    return this.ratesettingform.get('currencyType');
  }
  get agentBaseCurrency() {
    return this.ratesettingform.get('agentBaseCurrency');
  }
  get ProviderType() {
    return this.ratesettingform.get('ProviderType');
  }
  get BuyingRate() {
    return this.ratesettingform.get('BuyingRate');
  }
  get SellingRate() {
    return this.ratesettingform.get('SellingRate');
  }
  get MaximumBuyingRate() {
    return this.ratesettingform.get('MaximumBuyingRate');
  }
  get MinimumBuyingRate() {
    return this.ratesettingform.get('MinimumBuyingRate');
  }
  get MaximumSellingRate() {
    return this.ratesettingform.get('MaximumSellingRate');
  }
  get MinimumSellingRate() {
    return this.ratesettingform.get('MinimumSellingRate');
  }

  checkpositive(event: any, name: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode === 45) {
      this.notificationService.create(
        'error',
        'Error',
        `${name} Must be a positive value`,
        {
          nzStyle: { background: '#cc2d2d', color: '#fff' },
        }
      );

      return false;
    }
    console.log('values', charCode);

    return true;
  }
  update() {
    if (!this.ratesettingform.valid) {
      this.validateAllFormFields(this.ratesettingform);
      return;
    } else {
      if (this.rateData == null) {
        const data = {
          agentDetailsId: this.agentData.agentDetailsId,
          currencyTypeId: this.currencyType?.value,
          baseCurrencyId: this.agentData?.baseCurrencyId,
          providerType: this.ProviderType?.value,
          buyingRate: this.BuyingRate?.value,
          sellingRate: this.SellingRate?.value,
          maximumBuyingRate: this.MaximumBuyingRate?.value,
          minimumBuyingRate: this.MinimumBuyingRate?.value,
          maximumSellingRate: this.MaximumSellingRate?.value,
          minimumSellingRate: this.MinimumSellingRate?.value,
        };
        this.agentService.addAgentCurrencyRate(data).subscribe({
          next: (res: any) => {
            if (res['responseDto']) {
              this.notificationService.create(
                'success',
                'Success',
                'Rate added successfully',
                { nzStyle: { background: '#00A03E', color: '#fff' } }
              );
              this.getAllCurrencyRate();
              this.cancel();
            } else if (res['errors']) {
              this.notificationService.create('error', 'Error', res['errors'], {
                nzStyle: { background: '#cc2d2d' },
              });
            }
          },
        });
      } else if (this.rateData != null) {
        const data = {
          agentCurrencyRateId: this.rateData.agentCurrencyRateId,
          buyingRate: this.BuyingRate?.value,
          sellingRate: this.SellingRate?.value,
          maximumBuyingRate: this.MaximumBuyingRate?.value,
          minimumBuyingRate: this.MinimumBuyingRate?.value,
          maximumSellingRate: this.MaximumSellingRate?.value,
          minimumSellingRate: this.MinimumSellingRate?.value,
          // agentApprovedCurrencyRateId: this.agentApprovedCurrencyRateId,
        };
        this.agentService.updateRateSettings(data).subscribe({
          next: (res: any) => {
            if (res['responseDto']) {
              this.notificationService.create(
                'success',
                'Success',
                'Rate added successfully',
                { nzStyle: { background: '#00A03E', color: '#fff' } }
              );
              this.getAllCurrencyRate();
              this.rateData = null;
              this.cancel();
            } else if (res['errors']) {
              this.notificationService.create('error', 'Error', res['errors'], {
                nzStyle: { background: '#cc2d2d' },
              });
            }
          },
        });
      }
    }
  }
  cancel() {
    this.ratesettingform.reset();

    this.ratesettingform.patchValue({
      AgentName: this.agentData.agentName,
      agentBaseCurrency: this.agentData.baseCurrency,
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'AgentName': {
        return 'Agent Name';
      }
      case 'CurrencyType': {
        return 'Currency Type';
      }
      case 'agentBaseCurrency': {
        return 'agent Base Currency';
      }
      case 'ProviderType': {
        return 'Provider Type';
      }
      case 'BuyingRate': {
        return 'Buying Rate';
      }
      case 'SellingRate': {
        return 'Selling Rate';
      }
      case 'MaximumSellingRate': {
        return 'Maximum Selling Rate';
      }
      case 'MaximumBuyingRate': {
        return 'Maximum Buying Rate';
      }
      case 'MinimumBuyingRate': {
        return 'Minimum Buying Rate';
      }
      case 'MinimumSellingRate': {
        return 'Minimum Selling Rate';
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

  getAllCurrency() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;
    this.subAentSetting
      .getAllCurrencyType(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.currency_data = res['responseDto'];
          console.log('subCurrency', this.currency_data);
        },
      });
  }

  // getAllProvider() {
  //   const data: any = {};

  //   this.subAentSetting
  //     .getAllProviderType(data)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res) => {
  //         this.provider_data = res['responseDto'];
  //         console.log('subProvider', this.provider_data);
  //       },
  //     });
  // }

  getAllCurrencyRate() {
    const data: any = {};
    data['agentCurrencyRateId'] = this.agentCurrencyRateId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['currencyId'] = this.currencyId;
    data['providerType'] = this.providerType;
    data['agentId'] = this.dataService.selectedData.agentDetailsId;

    this.subAentSetting
      .getAllAgentCurrencyRate(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.totalRecords = res['responseDto'].totalRecords;
            this.tableData = res['responseDto']['payload'];
            console.log('subCuRate', this.totalRecords);

            // this.defaultData = this.existingAgentCustomers;
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
    this.getAllCurrencyRate();
  }

  edit(data: any) {
    console.log(data);
    this.rateData = data;
    this.newAgentCurrencyId = data.agentCurrencyRateId;
    this.getAgentCustomerApprovedCurrencyRate(data.agentCurrencyRateId);
  }
  getAgentCustomerApprovedCurrencyRate(id: any) {
    const data: any = {};
    data['agentCurrencyRateId'] = id;
    this.agentService
      .getAgentApprovedRates(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.agentApprovedCurrencyRateId =
            res['responseDto']['agentApprovedCurrencyRateId'];
          this.patchRateSetting(res['responseDto']);
        },
      });
  }
  patchRateSetting(receivedDdata: any) {
    this.ratesettingform.patchValue({
      currencyType: this.rateData.recivingCurrencyId,
      ProviderType: this.rateData.providerType,
      BuyingRate: receivedDdata.buyingRate,
      SellingRate: receivedDdata.sellingRate,
      MaximumBuyingRate: receivedDdata.maxBuyRate,
      MinimumBuyingRate: receivedDdata.minBuyRate,
      MaximumSellingRate: receivedDdata.maxSellRate,
      MinimumSellingRate: receivedDdata.minSellRate,
    });
  }
}
