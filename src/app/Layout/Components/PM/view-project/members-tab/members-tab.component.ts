import { Component, Input } from '@angular/core';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddMemberRoleComponent } from './add-member-role/add-member-role.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';

@Component({
  selector: 'app-members-tab',
  templateUrl: './members-tab.component.html',
  styleUrls: ['./members-tab.component.sass'],
})
export class MembersTabComponent {
  memberData: any = [];
  @Input() data: any;
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private dataService: DataService,
    private projectService: ProjectsService,
    private modalService: NzModalService,
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private eventTrigger: EventtriggerService
  ) {}

  ngOnInit() {
    this.getAllmemersData();

    this.eventTrigger.executeOnchangeFunction.subscribe((res) => {
      if (res === 'addSuccess') {
        this.getAllmemersData();
      }
    });
  }

  getAllmemersData() {
    const data: any = [];
    data['skip'] = 0;
    data['limit'] = 10;
    data['search'] = 'gayan';
    data['id'] = this.dataService.projectData.id;
    this.projectService.getALlmembers(data).subscribe((res: any) => {
      if (res) {
        this.memberData = res['data'];
      }
      console.log(this.memberData, 'res');
    });
  }

  addNewRole() {
    const modal = this.modalService.create({
      nzTitle: 'Add role',
      nzContent: AddMemberRoleComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-role',
    });
    modal.componentInstance!.data = this.data;
    modal.afterClose.subscribe((res: any) => {
      this.getAllmemersData();
    });
  }

  editproject(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'view role',
      nzContent: AddMemberRoleComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-role',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllmemersData();
    });
  }

  deleteproject(data: any) {
    data['project_id'] = data.id;
    data['user_id'] = data.user_id;
    this.projectService.deleteMemberRole(data).subscribe((res: any) => {
      if (res) {
        this.notificationService.create(
          'success',
          'Success',
          'Member Role Updated Successfully',
          { nzStyle: { background: '#00A03E', color: '#fff' } }
        );
        this.modalService.closeAll();
      } else {
        this.notificationService.create(
          'error',
          'Error',
          'Member Role Updated Failed',
          { nzStyle: { background: '#8f0505ff', color: '#fff' } }
        );
      }
    });
  }

  pageIndexChange(data: any) {}
}
