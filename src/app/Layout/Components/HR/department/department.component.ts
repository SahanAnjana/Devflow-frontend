import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DepartmentService } from 'src/app/_services/hr-services/department.service';
import { AddNewDepartmentComponent } from './add-new-department/add-new-department.component';
import { DepartmentProfileComponent } from './department-profile/department-profile.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
// import { ViewDepartmentComponent } from './add-new-department/view-department/view-department.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.sass'],
})
export class DepartmentComponent {
  allDepartments: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  constructor(
    private departmentService: DepartmentService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllDepartments();
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe((res: any) => {
      if (res) {
        this.allDepartments = res;
      }
    });
  }

  addNewDepartment(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Department',
      nzContent: AddNewDepartmentComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-department',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllDepartments();
    });
  }

  viewDepartment(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Department',
      nzContent: AddNewDepartmentComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-department',
    });
    modal.componentInstance!.data = data;
  }

  viewDepartmentProfile(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'Department Profile',
      nzContent: DepartmentProfileComponent,
      nzFooter: null,
      nzWidth: 700,
      nzClassName: 'department-profile-modal',
    });
    modal.componentInstance!.data = data;
  }

  editDepartment(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Department',
      nzContent: AddNewDepartmentComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-department',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllDepartments();
    });
  }

  deleteDepartment(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this department?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.departmentService.deleteDepartment(id).subscribe((res: any) => {
          if (res) {
            this.getAllDepartments();
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
    this.getAllDepartments();
  }
}
