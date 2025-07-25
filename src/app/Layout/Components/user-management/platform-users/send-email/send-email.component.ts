import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.sass'],
})
export class SendEmailComponent {
  sendEmailForm!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  emailSubjectDetails: any;

  @Input() mode: any = {};
  @Input() type!: 'view';

  @Input() getEmail: any;

  agentUser: any;

  constructor(
    private modalService: NzModalService,
    public modalRef: NzModalRef,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private corporateService: CoperateuserService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private fb: FormBuilder
  ) {
    this.agentUser = this.commonService.parseJwt(tokenService.getToken());
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
    console.log('Email', this.getEmail);
    console.log('Mode', this.mode);
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
    this.corporateService
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
      sentBy: this.getEmail ? this.getEmail : this.mode.email,
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
      sentBy: this.agentUser.sub,
      recieverEmail: this.mode.email ? this.mode.email : this.getEmail,
      subject: this.subject?.value,
      message: this.message?.value,
    };

    this.corporateService.sendEmail(formdata).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.createNotifications(
            'success',
            'Email Sent Successfully',
            '#3DEC12',
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
