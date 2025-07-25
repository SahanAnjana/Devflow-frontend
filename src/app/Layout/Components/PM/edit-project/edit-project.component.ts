import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.sass'],
})
export class EditProjectComponent {
  public viewProjectForm!: FormGroup;
  @Input() data: any;
  @Input() index: any = 'view';

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private notificationService: NzNotificationService,
    private modalRef: NzModalRef,
    private dataService: DataService
  ) {}
  ngOnInit() {
    this.viewProjectForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });

    if (this.index !== 'create') {
      this.getProgectData();
    }
    if (this.index === 'view') {
      this.viewProjectForm.disable();
    }
  }

  get name() {
    return this.viewProjectForm.get('name');
  }
  get description() {
    return this.viewProjectForm.get('description');
  }
  get startDate() {
    return this.viewProjectForm.get('startDate');
  }
  get endDate() {
    return this.viewProjectForm.get('endDate');
  }
  get status() {
    return this.viewProjectForm.get('status');
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'name': {
        return 'Name';
      }
      case 'description': {
        return 'Description';
      }
      case 'startDate': {
        return 'Start Date';
      }
      case 'endDate': {
        return 'End Date';
      }
      case 'status': {
        return 'Status';
      }
    }
  }

  getProgectData() {
    console.log('', this.dataService.projectData.id);
    this.projectService
      .getProjectDataById(
        this.data?.id ? this.data?.id : this.dataService.projectData?.id
      )
      .subscribe((res: any) => {
        if (res) {
          console.log('res', res['data']['start_date']);
          console.log('res', res['data']['end_date']);
          this.viewProjectForm.patchValue({
            name: res['data']['name'],
            description: res['data']['description'],
            startDate: res['data']['start_date'],
            endDate: res['data']['end_date'],
            status: res['data']['status'],
          });
        }
      });
  }

  createNewproject() {
    if (!this.viewProjectForm.valid) {
      return this.validateFormFields(this.viewProjectForm);
    } else {
      const formdata: any = {
        name: this.name?.value,
        description: this.description?.value,
        startDate: this.startDate?.value,
        endDate: this.endDate?.value,
        status: this.status?.value,
      };
      console.log('form data', formdata);
      this.projectService.createProject(formdata).subscribe((res: any) => {
        if (res) {
          this.notificationService.create(
            'success',
            'Success',
            'Project Updated Successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
        }
        this.modalRef.close();
      });
    }
  }
  submit() {
    if (!this.viewProjectForm.valid) {
      return this.validateFormFields(this.viewProjectForm);
    } else {
      const formdata: any = {
        name: this.name?.value,
        description: this.description?.value,
        startDate: this.startDate?.value,
        endDate: this.endDate?.value,
        status: this.status?.value,
        owner_id: this.data.id,
      };
      console.log('form data', formdata);
      this.projectService
        .updateProjectData(this.data.id, formdata)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Project Updated Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
          }
          this.modalRef.close();
        });
    }
  }
  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.viewProjectForm.controls).forEach((field: any) => {
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
