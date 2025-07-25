import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { IssuesService } from 'src/app/_services/pm-services/issues.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-add-new-issues',
  templateUrl: './add-new-issues.component.html',
  styleUrls: ['./add-new-issues.component.sass'],
})
export class AddNewIssuesComponent {
  public IssuesForm!: FormGroup;
  @Input() data: any;
  @Input() index: any = 'view';

  allMembers: any = [];
  allReporters: any = [];
  allPeojects: any = [];
  assigneeId: any;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private modalRef: NzModalRef,
    private notificationService: NzNotificationService,
    private issuesService: IssuesService
  ) {}

  ngOnInit() {
    this.IssuesForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      status: [null, Validators.required],
      priority: [null, Validators.required],
      issue_type: [null, Validators.required],
      assignee: [null, Validators.required],
      reporter: [null, Validators.required],
      project: [null, Validators.required],
      create_date: [null, Validators.required],
      update_date: [null, Validators.required],
    });
    if (this.index !== 'create') {
      this.getIssuesData();
    }

    if (this.index === 'view') {
      this.IssuesForm.disable();
    }
  }

  getIssuesData() {
    this.issuesService
      .getIssuesDataById(this.data?.id)
      .subscribe((res: any) => {
        if (res) {
          console.log('res', res['data']['start_date']);
          console.log('res', res['data']['end_date']);
          this.IssuesForm.patchValue({
            title: res['data']['title'],
            description: res['data']['description'],
            status: res['data']['status'],
            priority: res['data']['priority'],
            create_date: res['data']['created_at'],
            update_date: res['data']['updated_at'],
            phone: res['data']['phone'],
          });
        }
      });
  }

  createNewIssues() {}
  updateIssues() {}

  get title() {
    return this.IssuesForm.get('title');
  }
  get description() {
    return this.IssuesForm.get('description');
  }
  get status() {
    return this.IssuesForm.get('status');
  }
  get priority() {
    return this.IssuesForm.get('priority');
  }
  get issue_type() {
    return this.IssuesForm.get('issue_type');
  }
  get assignee() {
    return this.IssuesForm.get('assignee');
  }
  get reporter() {
    return this.IssuesForm.get('reporter');
  }
  get project() {
    return this.IssuesForm.get('project');
  }
  get create_date() {
    return this.IssuesForm.get('create_date');
  }
  get update_date() {
    return this.IssuesForm.get('update_date');
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'title': {
        return 'Title';
      }
      case 'description': {
        return 'Description';
      }
      case 'status': {
        return 'Status';
      }
      case 'priority': {
        return 'Priority';
      }
      case 'issue_type': {
        return 'Issue Type';
      }
      case 'assignee': {
        return 'Assignee';
      }
      case 'reporter': {
        return 'Reporter';
      }
      case 'project': {
        return 'Project';
      }
      case 'create_date': {
        return 'Create date';
      }
      case 'update_date': {
        return 'Update date';
      }
    }
  }

  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.IssuesForm.controls).forEach((field: any) => {
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
}
