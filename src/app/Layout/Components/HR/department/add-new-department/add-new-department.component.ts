import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DepartmentService } from 'src/app/_services/hr-services/department.service';
import { EmployeesService } from 'src/app/_services/hr-services/employees.service';

@Component({
  selector: 'app-add-new-department',
  templateUrl: './add-new-department.component.html',
  styleUrls: ['./add-new-department.component.sass'],
})
export class AddNewDepartmentComponent implements OnInit {
  addDepartmentForm!: FormGroup;
  data: any;
  index: any;
  managers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private employeesService: EmployeesService,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {
    this.addDepartmentForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      manager_id: [null, [Validators.required]],
    });

    this.getManagers();

    if (this.index === 'edit') {
      this.addDepartmentForm.patchValue(this.data);
    }
  }

  getManagers() {
    const data = { skip: 1, limit: 100, department_id: '', manager_id: '' };
    this.employeesService.getAllEmployees(data).subscribe((res) => {
      this.managers = res;
    });
  }

  saveNewDepartment() {
    if (this.addDepartmentForm.valid) {
      if (this.index === 'edit') {
        this.departmentService
          .updateDepartment(this.data.id, this.addDepartmentForm.value)
          .subscribe((res) => {
            this.modal.close(res);
          });
      } else {
        this.departmentService
          .createDepartment(this.addDepartmentForm.value)
          .subscribe((res) => {
            this.modal.close(res);
          });
      }
    } else {
      Object.values(this.addDepartmentForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.modal.close();
  }
}
