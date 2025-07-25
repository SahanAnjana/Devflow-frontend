import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PerformanceService } from 'src/app/_services/hr-services/performance.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddNewPerformanceComponent } from './add-new-performance/add-new-performance.component';
import { EmployeesService } from 'src/app/_services/hr-services/employees.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.sass'],
})
export class PerformanceComponent {
  allperformance: any;

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  Employees: any = [];
  employeeId: any;
  employeeById: any;

  constructor(
    private dataService: DataService,
    private performanceService: PerformanceService,
    private modalService: NzModalService,
    private employeesService: EmployeesService
  ) {}

  ngOnInit() {
    this.getAllPerformance();
    this.getAllEmployeeList();
  }

  getAllPerformance() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    this.performanceService.getAllPerformance().subscribe((res: any) => {
      this.allperformance = res;
    });
  }

  getAllPerformanceMe() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    this.performanceService.getAllPerformanceMe().subscribe((res: any) => {
      this.allperformance = res;
    });
  }

  getAllPerformanceByEmployee() {
    this.performanceService
      .getAllPerformanceByEmployee(this.employeeId)
      .subscribe((res: any) => {
        this.allperformance = res;
      });
  }

  addPerformance(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Performance',
      nzContent: AddNewPerformanceComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-performance',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPerformance();
    });
  }

  editPerformance(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Performance',
      nzContent: AddNewPerformanceComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-performance',
    });
    modal.componentInstance!.index = index;
    modal.componentInstance!.data = data;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPerformance();
    });
  }

  deletePerformance(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this performance?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.performanceService.deletePerformnace(id).subscribe((res: any) => {
          if (res) {
            this.getAllPerformance();
          }
        });
      },
      nzCancelText: 'No, cancel',
      nzIconType: 'warning',
    });
  }

  getAllEmployeeList() {
    this.employeesService.getAllEmployees({}).subscribe((res: any) => {
      this.Employees = res;
    });
  }

  showMyPerformance() {
    this.performanceService.readPerformanceByMe().subscribe((res: any) => {
      this.allperformance = res;
    });
  }
  getEmployee(employeeId: any) {
    this.employeeId = employeeId;
    this.getAllPerformanceByEmployee();
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    // this.getAllprojects();
  }
}
