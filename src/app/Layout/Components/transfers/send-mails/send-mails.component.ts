import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentService } from 'src/app/_services/sub-agent.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { Subject, takeUntil } from 'rxjs';
import { MyValidators } from 'src/app/validators/custom-validators';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
@Component({
  selector: 'app-send-mails',
  templateUrl: './send-mails.component.html',
  styleUrls: ['./send-mails.component.sass']
})
export class SendMailsComponent {
 
  destroy$: Subject<boolean> = new Subject<boolean>();
  emailSubjectDetails: any;
  clientData: any;
  sendEmail!:FormGroup
  viewTable: boolean = false;
  
  selectAll(){
    this.viewTable = !this.viewTable;
  }
  constructor(private modalService: NzModalService,
   
    public modalRef: NzModalRef,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private subAgentService: SubAgentService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private transfer: TransferTabService,
    private fb: FormBuilder)
    {
      this.clientData = this.commonService.parseJwt(
        localStorage.getItem('currentUser')
      );
  
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '207px',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images',
    
    outline:false,
    // customClasses: [ // optional
    //   {
    //     name: "quote",
    //     class: "quote",
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: "titleText",
    //     class: "titleText",
    //     tag: "h1",
    //   },
    // ],
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
      ]
    ]
  };
  close() {
    
    this.modalRef.close();
  }
  @Input() mode:any
  ngOnInit(): void{
console.log("mode",this.mode)
  const { customRequired, maxLength, minLength, email, pattern } =
  MyValidators;

  this.sendEmail = this.fb.group({
  sentBy: [null, [customRequired('Email Address')]],
  subject: [null, [customRequired('Subject')]],
  mailBody: [null, [customRequired('Message')]],
  });
  this.getAllEmailSubjects();
  // this.patchValuesForm();
  this.disabledFields();
  this.sendEmail.patchValue({
    sentBy: this.mode.email,
    
  });
 }
  sendMail(){
    console.log(this.sendEmail)
  }
  getAllEmailSubjects() {
    this.transfer
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
  getFieldName(option: any): any {
    switch (option) {
      case 'sentBy': {
        return 'Email Address';
      }
      case 'subject': {
        return 'Subject';
      }
      case 'mailBody': {
        return 'Message';
      }
    }
  }
  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.sendEmail.controls).forEach((field: any) => {
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
  get sentBy() {
    return this.sendEmail.get('sentBy');
  }

  get subject() {
    return this.sendEmail.get('subject');
  }

  get mailBody() {
    return this.sendEmail.get('mailBody');
  }
  // patchValuesForm() {
  //   this.sendEmail.patchValue({
  //     sentBy: this.dataService.selectedData.email,
  //   });
  // }

  disabledFields() {
    this.sendEmail.get('sentBy')?.disable();
  }
  SendMails() {
    if (!this.sendEmail.valid) {
      this.validateFormFields(this.sendEmail);
      return;
    }
    const formdata = {
      sentBy: this.clientData.sub,
      recieverEmail: this.sentBy?.value,
      subject: this.subject?.value,
      message: this.mailBody?.value,
      // isSuccess: true,
      // sentByUserId: this.dataService.selectedData.userId,
    };
    this.transfer.sendEmail(formdata).subscribe({
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
  }
