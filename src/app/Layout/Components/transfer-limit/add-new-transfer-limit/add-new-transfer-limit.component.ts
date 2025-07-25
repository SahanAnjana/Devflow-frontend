import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { CommonsService } from 'src/app/_services/commons.service';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { TransferLimitService } from 'src/app/_services/transfer-limit.service';

@Component({
  selector: 'app-add-new-transfer-limit',
  templateUrl: './add-new-transfer-limit.component.html',
  styleUrls: ['./add-new-transfer-limit.component.sass'],
})
export class AddNewTransferLimitComponent {
  visibileTable = false;
  currenciestype: any;
  durations: any;
  agentCustomerName: any;
  username: any;
  getdata: any;
  name: any = 'Prem';
  searcgdata: any;
  senderFirstName: any;
  tableData: any[] = [];
  private searchNameData = new Subject<any>();
  data$: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  searchResult: any;
  nameVal: any;
  agentSenderData: any = [];
  total: any;
  senderDetailsResult: any;
  agentSenderData2: any = [];
  Name = 'Name';
  currentUser: any;
  allAgents: any;
  email: any;
  exposableId: any;
  // agentSenderData = [];
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NzModalService,
    private dataService: DataService,
    private transferlimit: TransferLimitService,
    private modalRef: NzModalRef,
    private eventTriggerService: EventTriggerService,
    private notification: NzNotificationService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private transferService: MakeTransferService
  ) {
    this.currentUser = this.commonService.parseJwt(
      this.tokenService.getToken()
    );
  }

  transferlimitforms!: FormGroup;
  selectedValue = null;
  listOfOption: any = [];

  ngOnInit() {
    const {
      required,
      customSelectorRequired,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = CustomValidators;

    this.transferlimitforms = this.formBuilder.group({
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
      filter: [null, null],
      agentName: [null, null],
    });
    this.getAgent();
    this.getcurrenciestype();
    this.getdurationtype();
    this.searchSubscripe();
  }
  getAgent() {
    this.transferService
      .getAllAgents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res['responseDto']) {
          this.allAgents = res['responseDto'];
        }
      });
  }
  onChangeAgent(agentId: any) {
    this.email = agentId.agentEmail;
    this.exposableId = agentId.agentExposableId;
  }
  searchrxjs($event: any) {
    const value = $event;

    value ? this.searchNameData.next(value) : '';
    this.nameVal = value;
    if (value === '') {
      this.eventTriggerService.onReloadServiceData();
    }
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
        switchMap(async () => this.getAgentSenderDetailsByCriteria())
      )
      .subscribe((res: any) => {
        this.searchResult = res['responseDto'];
      });
  }
  change(event: any) {
    console.log('category', event);
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

  getAgentSenderDetailsByCriteria() {
    console.log('filter', this.filter?.value);
    const data: any = {};
    data['name'] = this.nameVal;
    data['email'] = this.email;
    this.transferlimit.search(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.searchResult = res['responseDto'];
        console.log('seach', this.filter?.value);
      }
    });
  }
  onChangeSender(data: any) {
    if (data) {
      this.senderDetailsResult = data;
    }
    // this.senderListOpen = null;
    console.log('cust', this.searchResult);
  }

  addNewCustomer() {
    if (this.filter?.value == null) {
      this.notification.create(
        'error',
        'Error',
        'Please Select Agent Customer',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      if (this.agentSenderData.length > 0) {
        this.total = this.agentSenderData.length;
        let i = 0;
        let count = 0;
        for (i = 0; i < this.total; i++) {
          if (this.agentSenderData[i] !== this.filter?.value) {
            count = count + 1;
          }
        }

        if (count !== i) {
          this.notification.create(
            'error',
            'Error',
            'Agent sender already added',
            {
              nzStyle: { background: '#cc2d2d', color: '#fff' },
            }
          );
        } else {
          this.agentSenderData.push(this.filter?.value);
        }
      } else {
        this.agentSenderData.push(this.filter?.value);
        this.filter?.setValidators(null);
        this.filter?.updateValueAndValidity();
      }
      this.transferlimitforms.patchValue({
        senderSearch: null,
      });
      this.visibileTable = true;
    }
  }

  removeCustomer(receivedData: any) {
    console.log('rec', receivedData);
    this.agentSenderData = this.agentSenderData.filter(
      (data: any) =>
        data.agentSenderDetailsId !== receivedData.agentSenderDetailsId
    );
    if (this.agentSenderData.length < 1) {
      this.visibileTable = false;
    }
  }

  validateForm() {
    Object.values(this.transferlimitforms.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  get maximumtransferlimit() {
    return this.transferlimitforms.get('maximumtransferlimit');
  }
  get maximumtransferamount() {
    return this.transferlimitforms.get('maximumtransferamount');
  }
  get agentApprovedSendingCurrencies() {
    return this.transferlimitforms.get('agentApprovedSendingCurrencies');
  }
  get duration() {
    return this.transferlimitforms.get('duration');
  }
  get filter() {
    return this.transferlimitforms.get('filter');
  }

  save() {
    console.log('send', this.agentSenderData);
    if (this.filter?.value == null) {
      this.notification.create(
        'error',
        'Error',
        'Please Select Agent Customer',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else if (this.visibileTable == false) {
      this.notification.create('error', 'Error', 'Please Add Agent Customer', {
        nzStyle: { background: '#cc2d2d', color: '#fff' },
      });
    } else if (!this.transferlimitforms.valid) {
      this.validateForm();
      return;
    } else {
      const agentCustomerList = this.agentSenderData.map(
        (item: { agentSenderDetailsId: any }) => item.agentSenderDetailsId
      );
      const data = {
        agentCustomerList: agentCustomerList,
        agentApprovedSendingCurrenciesId:
          this.agentApprovedSendingCurrencies?.value,
        maximumTransferLimit: this.maximumtransferlimit?.value,
        maximumTransferAmount: this.maximumtransferamount?.value,
        agentExposableId: 'JVb3mfaNS29',
        limitationId: this.duration?.value,
      };

      this.transferlimit.adddetails(data).subscribe((res: any) => {
        if (res['responseDto'] != null) {
          this.notification.create(
            'success',
            'Success',
            'Transfer Limit Added Successfully',
            {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            }
          );
          this.closeModal();
          this.eventTriggerService.onReloadServiceData();
        } else if (res['errors']) {
          this.notification.create('error', 'Error', res['errors'], {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
        }
      });
    }
  }
  closeModal() {
    this.modalRef.destroy();
  }

  // numberOnly(event: any) {
  //   return (
  //     event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)
  //   );
  // }
  numberOnly(event: any) {
    const value = event.target.value;

    // Prevent '0' as the first character unless it's followed by a decimal point
    if (value === '' && event.charCode == 48) {
      return false;
    }

    // Allow only numbers (48-57) and a single decimal point (46)
    if (event.charCode == 46 && value.includes('.')) {
      // Prevent multiple decimal points
      return false;
    }

    return (
      (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46
    );
  }
}
