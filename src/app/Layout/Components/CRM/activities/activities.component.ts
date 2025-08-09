import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivityService } from 'src/app/_services/crm/activity.service';
import { AddNewActivityComponent } from './add-new-activity/add-new-activity.component';
import { AddNewDepartmentComponent } from '../../HR/department/add-new-department/add-new-department.component';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.sass'],
})
export class ActivitiesComponent {
  allActivities: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private activityService: ActivityService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllActivities();
  }

  getAllActivities() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['contact_id'] = '';
    data['deal_id'] = '';
    data['activity_type'] = '';
    data['status'] = '';
    data['due_date_from'] = '';
    data['due_date_to'] = '';
    this.activityService.getAllActivities(data).subscribe((res: any) => {
      if (res) {
        this.allActivities = res['data'];
      }
    });
  }

  addNewActivity(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Activity',
      nzContent: AddNewActivityComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-activity',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllActivities();
    });
  }

  viewActivity(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Activity',
      nzContent: AddNewActivityComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-activity',
    });
    modal.componentInstance!.data = data;
  }

  editActivity(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Activity',
      nzContent: AddNewActivityComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-activity',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllActivities();
    });
  }

  deleteActivity(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this activity?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.activityService.deleteActivity(id).subscribe((res: any) => {
          if (res) {
            this.getAllActivities();
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
    this.getAllActivities();
  }
}
