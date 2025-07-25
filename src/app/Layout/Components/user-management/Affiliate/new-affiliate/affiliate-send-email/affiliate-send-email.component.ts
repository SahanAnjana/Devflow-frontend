import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { UsermanagementAffliateNewAffliateService } from 'src/app/_services/usermanagement-affliate-new-affliate.service';

@Component({
  selector: 'app-affiliate-send-email',
  templateUrl: './affiliate-send-email.component.html',
  styleUrls: ['./affiliate-send-email.component.sass'],
})
export class AffiliateSendEmailComponent {
  @Input() mode: any;
  public sendEmailForm!: FormGroup;

  allSubjects: any;

  public unsubscribe$ = new Subject<void>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '207px',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images',

    outline: false,
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
      ],
    ],
  };
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private usermanagementAffliateNewAffliateService: UsermanagementAffliateNewAffliateService,
    private notificationService: NzNotificationService,
    private modalRef: NzModalRef,
    private commonService: CommonsService,
    private tokenService: TokenserviceService
  ) {
    this.currentUser = this.commonService.parseJwt(
      this.tokenService.getToken()
    );
  }

  ngOnInit() {
    this.sendEmailForm = this.fb.group({
      mail: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.sendEmailForm.patchValue({
      mail: this.mode.email,
    });

    this.getAllSubjects();
  }

  get mail() {
    return this.sendEmailForm.get('mail');
  }

  get subject() {
    return this.sendEmailForm.get('subject');
  }

  get message() {
    return this.sendEmailForm.get('message');
  }

  getAllSubjects() {
    this.usermanagementAffliateNewAffliateService
      .getAllSubjects()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.allSubjects = res['responseDto'];
        }
      });
  }

  sendEmail() {
    const formdata: any = {
      sentBy: this.currentUser.sub,
      recieverEmail: this.mode.email,
      subject: this.subject?.value,
      message: this.message?.value,
    };
    this.usermanagementAffliateNewAffliateService
      .sendEmailForAffliate(formdata)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
          this.closemodal();
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }

  closemodal() {
    this.modalRef.destroy();
  }
}
