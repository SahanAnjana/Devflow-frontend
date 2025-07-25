import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { CommunicationService } from 'src/app/_services/communication.service';
import { ReportNotesService } from 'src/app/_services/report-notes.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.sass'],
})
export class AddNotesComponent {
  @Input() mode: any;
  addNotes!: FormGroup;
  viewTable: boolean = false;
  searchNameData: any;
  nameVal: any;
  searchResult: any;

  data$: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  agentData: any;
  subject: any;
  notesData: any;
  pageNumber: any = 1;
  pageSize: any = 15;
  totalRecords: any;
  currentUser: any;
  currentPageIndex: any;
  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private eventTriggerService: EventTriggerService,
    private reportNotes: ReportNotesService,
    private notificationService: NzNotificationService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private dataService: DataService
  ) {
    this.currentUser = this.commonService.parseJwt(tokenService.getToken());
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
  closeMail(): void {
    // Close the modal
    this.modalRef.close();
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getNotes();
  }
  ngOnInit() {
    this.addNotes = new FormGroup({
      subjectField: new FormControl(null, Validators.required),
      noteBody: new FormControl(null, Validators.required),
    });
    // this.addNotes = this.formBuilder.group({
    //   noteBody: [null, Validators.required],
    //   subjectField: [null, Validators.required],
    // });
    this.getSubject();
    this.getNotes();
    console.log('mail', this.dataService.senderMail);
  }
  get noteBody() {
    return this.addNotes.get('noteBody');
  }
  get subjectField() {
    return this.addNotes.get('subjectField');
  }
  getSubject() {
    this.reportNotes.getSubject().subscribe({
      next: (res) => {
        this.subject = res['responseDto'];
      },
    });
    console.log('transData', this.subject);
  }
  getPayloadKeys(): string[] {
    if (this.notesData != null) {
      return Object.keys(this.notesData);
    } else {
      return [];
    }
  }
  getNotes() {
    const data: any = {};
    data['transactionDetailId'] = this.dataService.agentSenderDetailsId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.reportNotes.getAllNotes(data).subscribe({
      next: (res) => {
        this.notesData = res['responseDto']['payload'];
        this.totalRecords = res['responseDto']['totalRecords'];
      },
    });
    console.log('transData', this.notesData);
  }
  addNote() {
    if (!this.addNotes.valid) {
      this.validateAllFormFields(this.addNotes);
    } else {
      const formData = {
        note: this.noteBody?.value,
        subject: this.subjectField?.value,
        agentTransactionDetailId: this.dataService.agentSenderDetailsId,
        createdBy: this.currentUser.sub,
      };

      this.reportNotes.addNotes(formData).subscribe(
        (res: any) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'Note added successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.getNotes();
            this.addNotes.reset();
            this.closeMail();
          } else
            [
              this.createNotification(
                'error',
                'Input Error',
                res['errorDescription'],
                '#ffffff',
                '#cc2d2d'
              ),
            ];
        },
        () => {
          this.notificationService.create(
            'error',
            'Error',
            'Note added failed',
            { nzStyle: { background: '#cc2d2d' } }
          );
        }
      );
    }
  }

  // addNote() {
  //   if (!this.addNotes.valid) {
  //     this.validateAllFormFields(this.addNotes);
  //     return;
  //   }
  //   const data = {
  //     subject: this.subjectField?.value,
  //     note: this.noteBody?.value,
  //     agentTransactionDetailId: this.mode.agentTransactionMasterId,
  //     createdBy: this.currentUser.sub,
  //   };
  //   this.reportNotes.addNotes(data).subscribe(
  //     (res: any) => {
  //       if (res['responseDto']) {
  //         this.createNotification(
  //           'success',
  //           'Success',
  //           'Note added successfully',
  //           '#ffffff',
  //           '#00A03E'
  //         );
  //         this.closeMail();
  //       } else {
  //         this.createNotification(
  //           'error',
  //           'Error',
  //           res.errorDescription,
  //           '#ffffff',
  //           '#cc2d2d'
  //         );
  //       }
  //     },
  //     () => {
  //       this.createNotification(
  //         'error',
  //         'Error',
  //         'Note Adding failed',
  //         '#ffffff',
  //         '#cc2d2d'
  //       );
  //     }
  //   );
  // }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
          control.markAsDirty();
          control.updateValueAndValidity();
          const fieldName = this.getFieldName(field);
          // this.notificationService.createNotification('error', fieldName + ' cannot be empty', '#cc2d2d', 'Input Error');
          this.createNotification(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            '#ffffff',
            '#cc2d2d'
          );
        } else {
          // this.isFieldValid(field);
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'subjectField': {
        return 'subjectField';
      }
      case 'noteBody': {
        return 'noteBody';
      }
    }
  }
  // get noteBody() {
  //   return this.addNotes.get('noteBody');
  // }
  // get subjectField() {
  //   return this.addNotes.get('subjectField');
  // }
  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
}
