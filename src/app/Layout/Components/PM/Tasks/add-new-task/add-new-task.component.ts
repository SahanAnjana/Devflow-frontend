import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { TaskService } from 'src/app/_services/pm-services/task.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.sass'],
})
export class AddNewTaskComponent {
  public taskForm!: FormGroup;

  @Input() data: any;
  @Input() index: any;
  allprojects: any = [];
  AllMembers: any = [];

  projectId: any;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private taskService: TaskService,
    private modalref: NzModalRef,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      taskTitle: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      estimatedTime: ['', [Validators.required]],
      project: ['', [Validators.required]],
      assignee: ['', [Validators.required]],
    });

    if (this.index !== 'create') {
      this.getTaskData();
    }

    if (this.index === 'view') {
      this.taskForm.disable();
    }

    this.getAllprojects();
  }

  get taskTitle() {
    return this.taskForm.get('taskTitle');
  }
  get taskDescription() {
    return this.taskForm.get('taskDescription');
  }
  get status() {
    return this.taskForm.get('status');
  }
  get priority() {
    return this.taskForm.get('priority');
  }
  get startDate() {
    return this.taskForm.get('startDate');
  }
  get endDate() {
    return this.taskForm.get('endDate');
  }
  get estimatedTime() {
    return this.taskForm.get('estimatedTime');
  }
  get project() {
    return this.taskForm.get('project');
  }
  get assignee() {
    return this.taskForm.get('assignee');
  }

  getAllprojects() {
    const data: any = [];
    this.projectsService.getALlProjects(data).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.allprojects = res['data'];
      }
    });
  }

  getProjectId(id: any) {
    console.log('id', id);
    this.projectId = id;
    this.getAllMembers(this.projectId);
  }
  getAllMembers(id: any) {
    const data: any = [];
    data['id'] = id;
    this.projectsService.getALlmembers(data).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.AllMembers = res.data[0];
        console.log('data', this.AllMembers);
      }
    });
  }

  createNewproject() {
    if (!this.taskForm.valid) {
      return this.validateFormFields(this.taskForm);
    } else {
      const formData: any = {
        title: this.taskTitle?.value,
        description: this.taskDescription?.value,
        status: this.status?.value,
        priority: this.priority?.value,
        due_date: this.endDate?.value,
        estimated_hours: this.estimatedTime?.value,
        tags: ['string'],
        column_id: 'string',
        position: 0,
        project_id: 'string',
        reporter_id: 'string',
        assignee_id: 'string',
      };
      this.taskService
        .cerateNewTask(formData, this.dataService.projectData.id)
        .subscribe((res: any) => {
          if (res['data']) {
            console.log(res['data']);
            this.notificationService.create(
              'success',
              'Success',
              'Task created successfully',
              { nzStyle: { background: '#17ac2bff', color: '#fff' } }
            );
            this.modalref.close();
          } else {
            this.notificationService.create(
              'error',
              'Input Error',
              'Task created failed',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        });
    }
  }

  getTaskData() {
    this.taskService.getTaskDetailsbyId(this.data.id).subscribe((res: any) => {
      if (res['data']) {
        this.taskForm.patchValue({
          taskTitle: res['data']['title'],
          taskDescription: res['data']['description'],
          status: res['data']['status'],
          priority: res['data']['priority'],
          startDate: res['data']['due_date'],
          endDate: res['data']['due_date'],
          estimatedTime: res['data']['estimated_hours'],
          project: res['data']['project_id'],
        });
      }
    });
  }

  UpdateTaskDetails() {
    if (!this.taskForm.valid) {
      return this.validateFormFields(this.taskForm);
    } else {
      const formData: any = {
        title: this.taskTitle?.value,
        description: this.taskDescription?.value,
        status: this.status?.value,
        priority: this.priority?.value,
        due_date: this.endDate?.value,
        estimated_hours: this.estimatedTime?.value,
        tags: ['string'],
        column_id: 'string',
        position: 0,
        project_id: this.project?.value,
        reporter_id: this.data.reporter_id,
        assignee_id: this.assignee?.value,
      };
      this.taskService
        .cerateNewTask(formData, this.data.id)
        .subscribe((res: any) => {
          if (res['data']) {
            console.log(res['data']);
            this.notificationService.create(
              'success',
              'Success',
              'Task Updated successfully',
              { nzStyle: { background: '#17ac2bff', color: '#fff' } }
            );
            this.modalref.close();
          } else {
            this.notificationService.create(
              'error',
              'Input Error',
              'Task Updated failed',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        });
    }
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'taskTitle': {
        return 'Task Title';
      }
      case 'taskDescription': {
        return 'Task Description';
      }
      case 'status': {
        return 'Status';
      }
      case 'priority': {
        return 'Priority';
      }
      case 'startDate': {
        return 'Start Date';
      }
      case 'endDate': {
        return 'End Date';
      }
      case 'stimatedTime': {
        return 'stimated Time';
      }
      case 'project': {
        return 'Project';
      }
      case 'assignee': {
        return 'Assignee';
      }
    }
  }

  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.taskForm.controls).forEach((field: any) => {
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
