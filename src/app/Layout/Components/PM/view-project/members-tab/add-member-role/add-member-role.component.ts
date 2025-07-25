import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-add-member-role',
  templateUrl: './add-member-role.component.html',
  styleUrls: ['./add-member-role.component.sass'],
})
export class AddMemberRoleComponent {
  public memberroleForm!: FormGroup;

  @Input() data: any;
  @Input() index: any = 'create';

  constructor(
    private dataService: DataService,
    private projectService: ProjectsService,
    private modalService: NzModalService,
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private eventTrigger: EventtriggerService
  ) {}

  ngOnInit() {
    this.memberroleForm = this.formBuilder.group({
      user: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });

    if (this.index === 'edit') {
      this.memberroleForm.patchValue({
        user: this.data.user,
        role: this.data.role,
      });
    }
  }

  get user() {
    return this.memberroleForm.get('user');
  }

  get role() {
    return this.memberroleForm.get('role');
  }

  createNewmemberRole() {
    if (!this.memberroleForm.valid) {
      return this.validateFormFields(this.memberroleForm);
    } else {
      const formdata: any = {
        user_id: this.user?.value,
        role: this.role?.value,
        project_id: this.data.id,
      };
      this.projectService
        .creatememberRole(formdata, this.data.id)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Member Role Added Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.eventTrigger.onReloadServiceData('addSuccess');
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'Member Role Added Failed',
              { nzStyle: { background: '#8f0505ff', color: '#fff' } }
            );
          }
        });
    }
  }

  updatememberRole() {
    if (!this.memberroleForm.valid) {
      return this.validateFormFields(this.memberroleForm);
    } else {
      const data: any = [];
      data['project_id'] = this.data.id;
      data['user_id'] = this.user?.value;
      const formdata: any = {
        role: this.role?.value,
      };
      this.projectService
        .updateMemberRole(formdata, data)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Member Role Updated Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.modalService.closeAll();
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'Member Role Updated Failed',
              { nzStyle: { background: '#8f0505ff', color: '#fff' } }
            );
          }
        });
    }
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'user': {
        return 'User';
      }
      case 'role': {
        return 'Role';
      }
    }
  }
  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.memberroleForm.controls).forEach((field: any) => {
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
