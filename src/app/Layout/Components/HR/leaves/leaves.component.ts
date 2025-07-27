import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LaevesService } from 'src/app/_services/hr-services/laeves.service';
import { AddNewLeaveComponent } from './add-new-leave/add-new-leave.component';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.sass'],
})
export class LeavesComponent {
  allLeaves: any;

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private leaveService: LaevesService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllLeaves();
  }

  getAllLeaves() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    // data['status'] = '';
    this.leaveService.getAllLeavesummary(data).subscribe((res) => {
      this.allLeaves = res;
    });
  }

  addnewLeave(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Leave',
      nzContent: AddNewLeaveComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-leave',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllLeaves();
    });
  }

  editLeave(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Leave',
      nzContent: AddNewLeaveComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-leave',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllLeaves();
    });
  }

  deleteLave(data: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this leave request?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.leaveService.deleteLeave(data.id).subscribe((res: any) => {
          if (res) {
            this.getAllLeaves();
          }
        });
      },
      nzCancelText: 'No, cancel',
      nzIconType: 'warning',
    });
    this.leaveService.deleteLeave(data.id).subscribe((res) => {
      if (res) {
        this.getAllLeaves();
      }
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    // this.getAllPoeitions();
  }
}
