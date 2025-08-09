import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DepartmentService } from 'src/app/_services/hr-services/department.service';
import { EmployeesService } from 'src/app/_services/hr-services/employees.service';
import { PositionsService } from 'src/app/_services/hr-services/positions.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.sass'],
})
export class ViewEmployeeComponent implements OnInit {
  @Input() data: any;
  viewEmployeeForm!: FormGroup;
  departments: any[] = [];
  positions: any[] = [];
  managers: any[] = [];

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private departmentService: DepartmentService,
    private positionsService: PositionsService
  ) {}

  ngOnInit(): void {
    this.viewEmployeeForm = this.fb.group({
      first_name: [null],
      last_name: [null],
      email: [null],
      phone: [null],
      hire_date: [null],
      salary: [null],
      department_id: [null],
      position_id: [null],
      manager_id: [null],
    });

    this.getDepartments();
    this.getPositions();
    this.getManagers();

    if (this.data) {
      this.viewEmployeeForm.patchValue(this.data);
    }
    this.viewEmployeeForm.disable();
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

  destroyModal(): void {
    this.modal.destroy();
  }
}
