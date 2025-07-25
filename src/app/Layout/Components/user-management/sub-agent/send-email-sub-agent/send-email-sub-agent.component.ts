import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';

import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentService } from 'src/app/_services/sub-agent.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-send-email-sub-agent',
  templateUrl: './send-email-sub-agent.component.html',
  styleUrls: ['./send-email-sub-agent.component.sass'],
})
export class SendEmailSubAgentComponent {
  sendEmailForm!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  emailSubjectDetails: any;
  clientData: any;
  @Input() email: any;
  constructor(
    private modalService: NzModalService,
    public modalRef: NzModalRef,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private subAgentService: SubAgentService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private fb: FormBuilder
  ) {
    this.clientData = this.commonService.parseJwt(
      localStorage.getItem('currentUser')
    );
  }

  get sentBy() {
    return this.sendEmailForm.get('sentBy');
  }

  get subject() {
    return this.sendEmailForm.get('subject');
  }

  get message() {
    return this.sendEmailForm.get('message');
  }

  ngOnInit() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;

    this.sendEmailForm = this.fb.group({
      sentBy: [null, [customRequired('Email Address')]],
      subject: [null, [customRequired('Subject')]],
      message: [null, [customRequired('Message')]],
    });

    this.getAllEmailSubjects();
    this.patchValuesForm();
    this.disabledFields();

    console.log(this.dataService.selectedData.agentEmail);
    console.log('AgentEmail......', this.dataService.selectedData.email);
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '207px',
    minHeight: '5rem',
    // maxHeight: 'auto',
    translate: 'no',
    placeholder: 'Enter text here...',
    toolbarHiddenButtons: [
      [
        'textColor',
        'backgroundColor',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'customClasses',
        'insertHorizontalRule',
      ],
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    // sanitize: true,
    // toolbarPosition: 'top',
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ]
  };

  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.sendEmailForm.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'sentBy': {
        return 'Email Address';
      }
      case 'subject': {
        return 'Subject';
      }
      case 'message': {
        return 'Message';
      }
    }
  }

  getAllEmailSubjects() {
    this.subAgentService
      .getEmailSubjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.emailSubjectDetails = res['responseDto'];
          }
        },
      });
  }

  patchValuesForm() {
    this.sendEmailForm.patchValue({
      sentBy: this.dataService.selectedData.email,
    });
  }

  disabledFields() {
    this.sendEmailForm.get('sentBy')?.disable();
  }

  sendEmail() {
    if (!this.sendEmailForm.valid) {
      this.validateFormFields(this.sendEmailForm);
      return;
    }
    const formdata = {
      sentBy: this.clientData.sub,
      recieverEmail: this.sentBy?.value,
      subject: this.subject?.value,
      message: this.message?.value,
      isSuccess: true,
      sentByUserId: this.dataService.selectedData.userId,
    };
    this.subAgentService.sendEmail(formdata).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.createNotifications(
            'Success',
            'Email Sent Successfully',
            '#F45300',
            'Success'
          );
          this.close();
        } else {
          this.createNotifications(
            'Failes',
            'Email Sent Failed',
            '#F45300',
            'Failed'
          );
        }
      },
    });
  }

  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
      },
    });
  }

  close() {
    this.modalRef.close();
  }
}
