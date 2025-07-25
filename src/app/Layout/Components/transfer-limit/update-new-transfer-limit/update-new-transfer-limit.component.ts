import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  UntypedFormGroup,
  FormBuilder,
} from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { AgentService } from 'src/app/_services/agent.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { TransferLimitService } from 'src/app/_services/transfer-limit.service';
@Component({
  selector: 'app-update-new-transfer-limit',
  templateUrl: './update-new-transfer-limit.component.html',
  styleUrls: ['./update-new-transfer-limit.component.sass'],
})
export class UpdateNewTransferLimitComponent {
  transferlimitform!: UntypedFormGroup;
  currenciestype: any;
  durations: any;
  username: any;
  getdata: any;
  pageNumber = 1;
  pageSize = 50;
  transferlimitdetails: any;
  agentTransferLimitId: any;
  limitDurationId: any;
  durationID: any;
  currentUser: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  exposableId: any;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NzModalService,
    private agentService: AgentService,
    private dataService: DataService,
    private transferlimit: TransferLimitService,
    private modalref: NzModalRef,
    private notification: NzNotificationService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private eventTrigger: EventTriggerService
  ) {
    this.currentUser = this.commonService.parseJwt(
      this.tokenService.getToken()
    );
  }

  ngOnInit(): void {
    const {
      required,
      customSelectorRequired,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = CustomValidators;

    this.transferlimitform = this.formBuilder.group({
      agentCustomerName: ['', customSelectorRequired('agentCustomerName')],
      agentApprovedSendingCurrencies: [
        '',
        customSelectorRequired('agentApprovedSendingCurrencies'),
      ],

      duration: ['', customSelectorRequired('duration')],
      maximumtransferlimit: [
        '',
        customSelectorRequired('maximumtransferlimit'),
      ],
      maximumtransferamount: [
        '',
        customSelectorRequired('maximumtransferamount'),
      ],
    });
    this.transferlimitform.controls['agentCustomerName'];
    this.transferlimitform.controls['maximumtransferamount'];

    this.getcurrenciestype();
    this.getdurationtype();
    this.disabledFields();
    console.log('output', this.dataService.transferData);
    this.transferlimitform.patchValue({
      agentCustomerName: this.dataService.transferData.agentCustomerName,
      agentApprovedSendingCurrencies:
        this.dataService.transferData.agentApprovedSendingCurrencyId,
      duration: this.dataService.transferData.durationId,
      maximumtransferlimit: this.dataService.transferData.transferLimitCount,
      maximumtransferamount: this.dataService.transferData.transferAmountLimit,
    });
  }

  getcurrenciestype() {
    const data: any = {};
    data['exposableId'] = 'JVb3mfaNS29';
    this.transferlimit.getcurrencies(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.currenciestype = res['responseDto'];
      }
    });
  }
  getdurationtype() {
    this.transferlimit.getduration().subscribe((res: any) => {
      if (res['responseDto']) {
        this.durations = res['responseDto'];
      }
    });
  }
  validateForm() {
    Object.values(this.transferlimitform.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  getexposabledid() {
    const data: any = {};
    data['username'] = this.currentUser.sub;
    this.transferlimit.getexposabledid(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.getdata = res['responseDto'];
      }
    });
  }
  get maximumtransferlimit() {
    return this.transferlimitform.get('maximumtransferlimit');
  }
  get maximumtransferamount() {
    return this.transferlimitform.get('maximumtransferamount');
  }
  get agentApprovedSendingCurrencies() {
    return this.transferlimitform.get('agentApprovedSendingCurrencies');
  }
  get duration() {
    return this.transferlimitform.get('duration');
  }
  get agentCustomerName() {
    return this.transferlimitform.get('agentCustomerName');
  }
  disabledFields() {
    this.transferlimitform.get('agentCustomerName')?.disable();
    // this.transferlimitform.get('maximumtransferamount')?.disable();
  }

  updatesetting() {
    if (!this.transferlimitform.valid) {
      this.validateForm();
      console.log('form', this.transferlimitform);
      return;
    } else {
      console.log('form', this.transferlimitform);
      const data = {
        agentCustomerId: this.dataService.transferData.agentCustomerId,
        agentApprovedSendingCurrenciesId:
          this.agentApprovedSendingCurrencies?.value,
        maximumTransferLimit: this.maximumtransferlimit?.value,
        maximumTransferAmount: this.maximumtransferamount?.value,
        agentExposableId: 'JVb3mfaNS29',
        limitationId: this.duration?.value,
        agentTransferLimitationDetailsId:
          this.dataService.transferData.agentTransferLimitId,
      };
      this.transferlimit.updatetranferlimit(data).subscribe((res: any) => {
        if (res['responseDto'] != null) {
          this.notification.create(
            'success',
            'Transfer Limit details Update Successfully',
            '',
            {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            }
          );
          this.closeModal();
          this.eventTrigger.onReloadServiceData();

          this.eventTrigger.onReloadServiceData();
        } else {
          this.notification.create(
            'error',
            'Transfer Limit details Update failed',
            ''
          );
        }
      });
    }
  }
  closeModal() {
    this.modalref.destroy();
  }

  numberOnly(event: any) {
    return (
      event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)
    );
  }
}
