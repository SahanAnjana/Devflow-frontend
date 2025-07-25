import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { CommonsService } from 'src/app/_services/commons.service';
import { EmailService } from 'src/app/_services/email.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.sass'],
})
export class SendMailComponent {
  public sendEmailForm!: FormGroup;
  clientData: any;
  transferRequestSelectedData: any;
  selectedTransactionReference: any;

  emailSubjects: any[] = [];
  isOtherSubejct = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [
      // optional
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
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

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    // private platformUserDataService: PlatformUserDataService,
    private commonsService: CommonsService,
    private dataService: DataService,
    private modalRef: NzModalRef,
    private emailService: EmailService // private transactionDetailDataService: TransactionDetailDataService, // private emailSubjectDataService: EmailSubjectDataService, // private coporateSenderDataService: CoporateSenderDataService
  ) {
    this.clientData = this.commonsService.parseJwt(
      localStorage.getItem('currentUser')
    );
  }

  ngOnInit() {
    this.sendEmailForm = this.formBuilder.group({
      emailAddress: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(
            // tslint:disable-next-line: max-line-length
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            { has: true }
          ),
        ]),
      ],
      emailSubject: [null, Validators.required],
      otherSubject: [null],
      message: [null, Validators.required],
    });

    if (this.dataService.clickEventStatus === 'CustomerTransaction') {
      this.getTransferRequestSelectedRowData();
    } else {
      this.sendEmailForm.patchValue({
        emailAddress: this.dataService.selectedData,
      });
    }
    console.log('log', this.dataService.selectedData);

    this.getAllEmailSubjects();
  }

  get emailAddress() {
    return this.sendEmailForm.get('emailAddress');
  }
  get emailSubject() {
    return this.sendEmailForm.get('emailSubject');
  }
  get otherSubject() {
    return this.sendEmailForm.get('otherSubject');
  }
  get message() {
    return this.sendEmailForm.get('message');
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
          // this.isFieldValid(field);
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldValid(field: string) {
    if (
      !this.emailAddress!.get(field)!.valid &&
      this.emailAddress!.get(field)!.touched
    ) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Email must be valid email',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    }
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'emailAddress': {
        return 'Email Address';
      }
      case 'emailSubject': {
        return 'Email Subject';
      }
      case 'otherSubject': {
        return 'Other Email Subject';
      }
      case 'message': {
        return 'Message';
      }
    }
  }

  getAllEmailSubjects() {
    this.emailService.getEmailSubjects().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.emailSubjects = res['responseDto'];
        }
      },
    });
  }

  sendEmail() {
    if (!this.sendEmailForm.valid) {
      this.validateAllFormFields(this.sendEmailForm);
    } else {
      const formData = {
        emailSendingDetailsId: null,
        sentOn: null,
        sentBy: this.clientData.sub,
        recieverEmail: this.emailAddress!.value,
        subject: this.emailSubject?.value,
        message: this.message!.value,
        transactionReference: this.selectedTransactionReference,
      };
      this.emailService.sendEmail(formData).subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'Email sent successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.closeModal();
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'Unable to send email to given email',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        },
      });
    }
  }

  getTransferRequestSelectedRowData() {
    this.transferRequestSelectedData = this.dataService.selectedData;

    if (this.transferRequestSelectedData.isAgent) {
      const data = this.transferRequestSelectedData.transactionMasterId;

      // this.transactionDetailDataService.getAgentTransactionDetails(data).subscribe((res:any) => {
      //   this.sendEmailForm.patchValue({
      //     emailAddress: res['responseDto']['agentTransactionDetailListDtos'][0]['agentSenderDetailsDto']['email']
      //   });
      //   this.selectedTransactionReference = res['responseDto']['agentTransactionDetailListDtos'][0]['transactionReferenceNumber'];
      // });
    } else {
      const data = this.transferRequestSelectedData.transactionMasterId;

      // this.transactionDetailDataService.getAdminTransactionDetails(data).subscribe((res:any) => {
      //   this.sendEmailForm.patchValue({
      //     emailAddress: res['responseDto']['transactionDetailDtos'][0]['transactionSenderDetailsDtos'][0]['senderDetailDto']['email']
      //   });
      //   this.selectedTransactionReference = res['responseDto']['transactionSenderDetailsDtos'][0]['transactionReferenceNumber'];
      // });
    }
  }

  closeModal() {
    this.dataService.isCooperateUser = false;
    this.modalRef.destroy();
  }
}
