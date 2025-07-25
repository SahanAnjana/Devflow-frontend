import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DepartmentService } from 'src/app/_services/hr-services/department.service';
import { EmployeesService } from 'src/app/_services/hr-services/employees.service';
import { PositionsService } from 'src/app/_services/hr-services/positions.service';

@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.sass'],
})
export class AddNewEmployeeComponent {
  addEmployeeForm!: FormGroup;
  data: any;
  index: any;
  departments: any[] = [];
  positions: any[] = [];
  managers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private departmentService: DepartmentService,
    private positionsService: PositionsService,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      hire_date: [null, [Validators.required]],
      salary: [null, [Validators.required]],
      department_id: [null, [Validators.required]],
      position_id: [null, [Validators.required]],
      manager_id: [null, [Validators.required]],
    });

    if (this.index === 'edit') {
      this.addEmployeeForm.patchValue(this.data);
    }
    this.getDepartments();
    this.getPositions();
    this.getManagers();
  }

  getDepartments() {
    this.departmentService.getAllDepartments().subscribe((res) => {
      this.departments = res;
    });
  }

  getPositions() {
    const data = { skip: 1, limit: 100 };
    this.positionsService.getAllPositions(data).subscribe((res) => {
      this.positions = res;
    });
  }

  getManagers() {
    const data = { skip: 1, limit: 100, department_id: '', manager_id: '' };
    this.employeesService.getAllEmployees(data).subscribe((res) => {
      this.managers = res;
    });
  }

  saveNewEmployee() {
    if (this.addEmployeeForm.valid) {
      this.employeesService
        .createEmployee(this.addEmployeeForm.value)
        .subscribe((res) => {
          this.modal.close(res);
        });
    } else {
      Object.values(this.addEmployeeForm.controls).forEach((control) => {
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
