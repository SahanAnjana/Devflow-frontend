import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor'; /// install this one (npm i @kolkov/angular-editor)
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import format from 'date-fns/format';
import { NotesService } from 'src/app/_services/notes.service';
import { ReportNotesService } from 'src/app/_services/report-notes.service';

@Component({
  selector: 'app-add-notes-modal',
  templateUrl: './add-notes-modal.component.html',
  styleUrls: ['./add-notes-modal.component.sass'],
})
export class AddNotesModalComponent {
  public addNoteForm!: FormGroup;
  notesArray = [];
  today = new Date();
  currentDate: any;
  currentTime: any;
  addedDate: any;
  subArray: any;
  subArrayName: any;
  subjects: any;
  subjectArrayName: any;
  addedTime: any;
  pageNumber = 1;
  pageSize = 10;
  currentPageIndex = 1;
  totalRecords: any;
  nodeArr: any;
  customerNotes = new Array();
  editCustomerNoteDetails: any;
  noteStatus = 'addNewNote';

  // editorConfig

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '227px',
    minHeight: '0',
    maxHeight: 'auto',
    width: '100%',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
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

  clientData: any;
  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private commonsService: CommonsService,
    private noteService: NotesService,
    private dataService: DataService,
    private modalRef: NzModalRef,
    private reportNotes: ReportNotesService // private transactionDetailDataService: TransactionDetailDataService, // private customerNotesDataService: CustomerNotesDataService
  ) {
    this.clientData = this.commonsService.parseJwt(
      localStorage.getItem('currentUser')
    );
  }

  ngOnInit() {
    this.addNoteForm = this.formBuilder.group({
      note: [null, Validators.required],
      subject: [null, Validators.required],
    });
    this.getAllNotes();
    this.getSubject();
  }
  getSubject() {
    this.reportNotes.getSubject().subscribe({
      next: (res) => {
        this.subjects = res['responseDto'];
      },
    });
    console.log('transData', this.subject);
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllNotes();
  }

  get note() {
    return this.addNoteForm.get('note');
  }
  get subject() {
    return this.addNoteForm.get('subject');
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'subject': {
        return 'Subject';
      }
      case 'note': {
        return 'Note';
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

  addNote() {
    if (!this.addNoteForm.valid) {
      this.validateAllFormFields(this.addNoteForm);
    } else {
      const formData = {
        note: this.note?.value,
        subject: this.subject?.value,
        addedDate: format(this.today, 'yyyy-MM-dd'),
        addedTime: format(this.today, 'HH:mm:ss'),
        createdBy: this.clientData.sub,
        isActive: 1,
        agentSenderDetailsDto: {
          agentSenderDetailsId: this.dataService.agentSenderDetailsId,
        },
      };

      this.noteService.sendCustomerNotes(formData).subscribe(
        (res: any) => {
          this.notificationService.create(
            'success',
            'Success',
            'Note added successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.getAllNotes();
          this.addNoteForm.reset();
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

  // updateNote() {
  //   if (!this.addNoteForm.valid) {
  //     this.validateAllFormFields(this.addNoteForm);
  //   } else {
  //     const formData = {
  //       customerNotesId: this.editCustomerNoteDetails.customerNotesId,
  //       note: this.note!.value,
  //       subject: this.subject!.value,
  //       addedDate: this.editCustomerNoteDetails.addedDate,
  //       addedTime: this.editCustomerNoteDetails.addedTime,
  //       updatedDate: this.currentDate,
  //       updatedTime: this.currentTime,
  //       createdBy: this.editCustomerNoteDetails.createdBy,
  //       isActive: 1,
  //       agentSenderDetailsDto: {
  //         agentSenderDetailsId:
  //           this.editCustomerNoteDetails.agentSenderDetailsDto
  //             .agentSenderDetailsId,
  //       },
  //     };
  //     this.customerNotesDataService.updateCustomerNotes(formData).subscribe(
  //       (res: any) => {
  //         this.notificationService.create(
  //           'success',
  //           'Success',
  //           'Note Updated successfully',
  //           { nzStyle: { background: '#00A03E' } }
  //         );
  //         this.addNoteForm = this.formBuilder.group({
  //           note: [null, Validators.required],
  //         });
  //         this.getAllNotes();
  //       },
  //       () => {
  //         this.notificationService.create(
  //           'error',
  //           'Error',
  //           'Note Updated failed',
  //           { nzStyle: { background: '#cc2d2d' } }
  //         );
  //       }
  //     );
  //   }
  // }

  getAllNotes() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['agentSenderDetailsId'] = this.dataService.agentSenderDetailsId;
    this.noteService.getCustomerNotes(data).subscribe((res: any) => {
      if (res['responseDto'] === null) {
        this.customerNotes = [];
      } else if (res['responseDto']['payload'] === null) {
        this.customerNotes = [];
      } else {
        this.totalRecords = res['responseDto'].totalRecords;
        this.customerNotes = res['responseDto']['payload'];
      }
    });
  }

  editCustomerNote(receviedData: any) {
    this.editCustomerNoteDetails = receviedData;
    this.noteStatus = 'editNote';
    this.addNoteForm.patchValue({
      note: this.editCustomerNoteDetails.note,
    });
  }
  closeModal() {
    this.modalRef.destroy();
  }
}
