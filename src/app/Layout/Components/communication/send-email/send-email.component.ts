import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
import { CommunicationService } from 'src/app/_services/communication.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';

import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.sass'],
})
export class SendEmailComponent {
  sendEmail!: UntypedFormGroup;
  viewTable: boolean = false;

  nameVal: any;
  searchResult: any;
  private searchNameData = new Subject<any>();
  data$: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  agentData: any;
  agentSenderData: any = [];
  total: any;
  visibileTable = false;
  senderDetailsResult: any;
  currentUser: any;
  agentListData: any;
  selectedAgentName: any;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private modalRef: NzModalRef,
    private eventTriggerService: EventtriggerService,
    private communicationService: CommunicationService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService
  ) {
    this.currentUser = this.commonService.parseJwt(
      this.tokenService.getToken()
    );
  }
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
    this.sendEmail = this.formBuilder.group({
      selectAgent: ['', customSelectorRequired('Select Agent')],
      filter: [null, null],
      addNewEmail: ['', null],
      newEmail: ['', null],
      subject: ['', customSelectorRequired('Subject')],
      mailBody: ['', customSelectorRequired('Mail Body')],
    });
    this.searchSubscripe();
    this.addNewEmail?.disable();
    this.newEmail?.disable();
    this.getAgentList();
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '207px',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images',

    outline: false,

    toolbarHiddenButtons: [
      [
        // 'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        // 'removeFormat',
        // 'toggleEditorMode'
      ],
    ],
  };
  validateForm() {
    Object.values(this.sendEmail.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  closeMail(): void {
    // Close the modal
    this.modalRef.close();
  }

  get selectAgent() {
    return this.sendEmail.get('selectAgent');
  }
  get filter() {
    return this.sendEmail.get('filter');
  }
  get addNewEmail() {
    return this.sendEmail.get('addNewEmail');
  }
  get newEmail() {
    return this.sendEmail.get('newEmail');
  }
  get subject() {
    return this.sendEmail.get('subject');
  }
  get mailBody() {
    return this.sendEmail.get('mailBody');
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
        switchMap(async () => this.getAgentSenderSearch())
      )
      .subscribe((res: any) => {});
  }
  onChangeSender(data: any) {
    console.log('cust', data.target.value);
    if (data) {
      this.senderDetailsResult = data;
    }
    // this.senderListOpen = null;
    // console.log('cust', this.searchResult);
  }
  selectAll() {
    this.viewTable = !this.viewTable;
  }
  unselectAll() {
    this.agentSenderData = [];
  }

  getAgentSenderSearch() {
    const data: any = {};
    data['name'] = this.nameVal;
    data['email'] = this.selectAgent?.value.agentEmail;
    this.communicationService.getAgentSender(data).subscribe({
      next: (res: any) => {
        this.searchResult = res['responseDto'];
        // console.log(this.searchResult);
      },
    });
    // console.log('transData', this.agentData);
  }
  addNewCustomer() {
    // this.agentSenderData = this.filter?.value;
    // console.log(this.agentSenderData);

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
      //  this.transferlimitforms.patchValue({
      //    senderSearch: null,
      //  });
      this.visibileTable = true;
    }

    // if (this.filter?.value == null) {
    //   this.notification.create('error', 'Please Select Agent Customer', '');
    // } else {
    //   if (this.agentSenderData.length > 0) {
    //     this.total = this.agentSenderData.length;
    //     let i = 0;
    //     let count = 0;
    //     for (i = 0; i < this.total; i++) {
    //       if (this.agentSenderData[i] !== this.filter?.value) {
    //         count = count + 1;
    //       }
    //     }

    //     if (count !== i) {
    //       this.notification.create('error', 'Agent Customer already added', '');
    //     } else {
    //       this.agentSenderData.push(this.filter?.value);
    //     }
    //   } else {
    //     this.agentSenderData.push(this.filter?.value);
    //     this.filter?.setValidators(null);
    //     this.filter?.updateValueAndValidity();
    //   }
    //   this.sendEmail.patchValue({
    //     senderSearch: null,
    //   });
    //   this.visibileTable = true;
    // }
    // console.log('sender Data', this.agentSenderData);
  }

  removeCustomer(receivedData: any) {
    // console.log('rec', receivedData.agentSenderDetailsId);
    this.agentSenderData = this.agentSenderData.filter(
      (data: any) => data.email !== receivedData.email
    );
    if (this.agentSenderData.length < 1) {
      this.visibileTable = false;
    }
  }
  getAgentName(name: any) {
    this.selectedAgentName = name.agentName;
  }
  sendMail() {
    // console.log(this.sendEmail);
    if (this.filter?.value == null) {
      this.notification.create(
        'error',
        'Error',
        'Please Select Agent Customer',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else if (this.agentSenderData == null) {
      this.notification.create('error', 'Error', 'Please Add Agent Customer', {
        nzStyle: { background: '#cc2d2d', color: '#fff' },
      });
    } else if (!this.sendEmail.valid) {
      this.validateForm();
      return;
    } else {
      const agentCustomerList = this.agentSenderData.map(
        (item: { email: any }) => item.email
      );
      const body = {
        sentBy: this.selectAgent?.value.agentEmail,
        receipientMailList: agentCustomerList,
        message: this.mailBody?.value,
        subject: this.subject?.value,
      };
      this.communicationService.sendEmai(body).subscribe((res: any) => {
        if (res['responseDto'] != null) {
          this.notification.create(
            'success',
            'Success',
            'Email Sent Successfully',
            {
              nzStyle: { background: '#00A03E', color: '#ffffff' },
            }
          );
          this.eventTriggerService.onReloadServiceData('comMail');
          this.closeMail();
          // console.log(body);
        } else {
          this.notification.create('error', 'Error', res['errorDescription'], {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
        }
      });
    }
  }
  getAgentList() {
    this.communicationService.getAllAgent().subscribe({
      next: (res: any) => {
        this.agentListData = res['responseDto'];
        // console.log(this.searchResult);
      },
    });
  }
}
