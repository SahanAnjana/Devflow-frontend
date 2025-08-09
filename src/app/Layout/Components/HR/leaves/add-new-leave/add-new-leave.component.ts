import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { LaevesService } from 'src/app/_services/hr-services/laeves.service';

@Component({
  selector: 'app-add-new-leave',
  templateUrl: './add-new-leave.component.html',
  styleUrls: ['./add-new-leave.component.sass'],
})
export class AddNewLeaveComponent {
  @Input() data: any;
  @Input() index: any;

  public addLeaveForm!: FormGroup;
  otherField: boolean = false;

  showFields: any;

  leavesTypes: any = [
    {
      id: 1,
      name: 'Personal',
    },
    {
      id: 2,
      name: 'Maternity/Paternity',
    },
    {
      id: 3,
      name: 'Sick',
    },
    {
      id: 4,
      name: 'Bereavement',
    },
    {
      id: 5,
      name: 'Vacation',
    },
    {
      id: 6,
      name: 'Other',
    },
  ];

  Employees: any = [];
  Status: any = [
    {
      id: 1,
      name: 'Pending',
    },
    {
      id: 2,
      name: 'Approved',
    },
    {
      id: 3,
      name: 'Rejected',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private leaveService: LaevesService
  ) {}

  ngOnInit() {
    this.addLeaveForm = this.fb.group({
      leave_type: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      employee: ['', [Validators.required]],
      created_at: ['', [Validators.required]],
      updated_at: ['', [Validators.required]],
      otherLeave: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    if (this.index === 'create') {
      this.showFields = false;
    } else {
      this.showFields = true;
      this.getLeavesById();
    }
  }
  get leave_type() {
    return this.addLeaveForm.get('leave_type');
  }
  get reason() {
    return this.addLeaveForm.get('reason');
  }
  get start_date() {
    return this.addLeaveForm.get('start_date');
  }
  get end_date() {
    return this.addLeaveForm.get('end_date');
  }
  get employee() {
    return this.addLeaveForm.get('employee');
  }
  get otherLeave() {
    return this.addLeaveForm.get('otherLeave');
  }
  get status() {
    return this.addLeaveForm.get('status');
  }

  onLeaveTypeChange(id: any) {
    if (id === 6) {
      this.otherField = true;
    } else {
      this.otherField = false;
      this.addLeaveForm.get('otherLeave')?.setValidators([]);
      this.addLeaveForm.get('otherLeave')?.updateValueAndValidity();
    }
  }

  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.addLeaveForm.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    });
  }

  close() {
    this.modal.close();
  }

  saveNewLeave() {
    this.addLeaveForm.get('status')?.setValidators([]);
    this.addLeaveForm.get('status')?.updateValueAndValidity();
    if (!this.addLeaveForm.valid) {
      return this.validateFormFields(this.addLeaveForm);
    } else {
      const formdata: any = {
        leave_type: this.showFields
          ? this.otherLeave?.value
          : this.leave_type?.value,
        reason: this.reason?.value,
        start_date: this.start_date?.value,
        end_date: this.end_date?.value,
        employee_id: this.employee?.value,
      };
      this.leaveService.addLeaveRequest(formdata).subscribe((res) => {
        if (res) {
          this.modal.close();
        }
      });
    }
  }

  getLeavesById() {
    this.leaveService.getAllLeaveData(this.data.id).subscribe((res: any) => {
      this.Employees = res;
      this.addLeaveForm.patchValue({
        leave_type: this.Employees.leave_type,
        reason: this.Employees.reason,
        start_date: this.Employees.start_date,
        end_date: this.Employees.end_date,
        employee: this.Employees.employee_id,
      });
    });
  }
  updateLeave() {
    if (!this.addLeaveForm.valid) {
      return this.validateFormFields(this.addLeaveForm);
    } else {
      const formdata: any = {
        leave_type: this.showFields
          ? this.otherLeave?.value
          : this.leave_type?.value,
        reason: this.reason?.value,
        start_date: this.start_date?.value,
        end_date: this.end_date?.value,
        status: this.status?.value,
      };
      this.leaveService
        .UpdateLeaveRequest(formdata, this.data.id)
        .subscribe((res) => {
          if (res) {
            this.modal.close();
          }
        });
    }
  }
}
