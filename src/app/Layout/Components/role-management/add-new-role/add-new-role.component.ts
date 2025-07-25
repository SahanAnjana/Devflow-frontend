import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.sass'],
})
export class AddNewRoleComponent {
  addNewRoleForm!: FormGroup;

  ngOnInit() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;
    this.addNewRoleForm = this.fb.group({
      roleName: [null, [customRequired('Role Name')]],
      roleDescription: [null, [customRequired('Role Description')]],
    });
  }

  constructor(
    private notificationService: NzNotificationService,
    public modalRef: NzModalRef,
    private fb: FormBuilder,
    private roleManagmentService: RolemanagementService
  ) {}

  get roleName() {
    return this.addNewRoleForm.get('roleName');
  }

  get roleDescription() {
    return this.addNewRoleForm.get('roleDescription');
  }

  validateAllFormFields(formgroup: FormGroup) {
    Object.keys(this.addNewRoleForm.controls).forEach((field: any) => {
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
        this.validateAllFormFields(control);
      }
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'roleName': {
        return 'Role Name';
      }
      case 'roleDescription': {
        return 'Role Description';
      }
    }
  }

  addNewRole() {
    if (!this.addNewRoleForm.valid) {
      this.validateAllFormFields(this.addNewRoleForm);
      return;
    }

    const formData = {
      roleName: this.roleName?.value,
      roleDescription: this.roleDescription?.value,
      isActive: false,
    };

    this.roleManagmentService.addNewRole(formData).subscribe({
      next: (res) => {
        if (res['responseDto']) {
          this.createNotifications(
            'success',
            'New Role Added Successfully',
            '#F45300',
            'Success'
          );
          this.close();
        } else {
          this.createNotifications(
            'Error',
            res['errorDescription'],
            '#F45300',
            'Error'
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
    // console.log('createNotification');
    // title: string, message: string
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }

  close() {
    this.modalRef.close();
  }
}
