import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EmployeesService } from 'src/app/_services/hr-services/employees.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddNewEmployeeComponent } from './add-new-employee/add-new-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';

interface Employee {
  // id: number;
  // name: string;
  // email: string;
  // department: string;
  // position: string;
  // joinDate: string;
  // status: 'Active' | 'Inactive' | 'On Leave';
  // phone: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.sass'],
})
export class EmployeesComponent {
  allEmployees: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  constructor(
    public dataService: DataService,
    private employeesService: EmployeesService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getAllEmployees();
  }

  getAllEmployees() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['department_id'] = '';
    data['manager_id'] = '';
    this.employeesService.getAllEmployees(data).subscribe((res: any) => {
      if (res) {
        this.allEmployees = res;
        // this.totalRecord = res;
      }
    });
  }

  addNewEmployee(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Employee',
      nzContent: AddNewEmployeeComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-employee',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllEmployees();
    });
  }

  viewEmployee(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Employee',
      nzContent: ViewEmployeeComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-employee',
    });
    modal.componentInstance!.data = data;
  }

  viewProfile(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'Employee Profile',
      nzContent: EmployeeProfileComponent,
      nzFooter: null,
      nzWidth: 600,
      nzClassName: 'employee-profile-modal',
    });
    modal.componentInstance!.data = data;
  }

  editEmployee(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Employee',
      nzContent: AddNewEmployeeComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-employee',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllEmployees();
    });
  }

  deleteEmployee(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this employee?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.employeesService.deleteEmployeeData(id).subscribe((res: any) => {
          if (res) {
            this.getAllEmployees();
          }
        });
      },
      nzCancelText: 'No, cancel',
      nzIconType: 'warning',
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllEmployees();
  }
}
