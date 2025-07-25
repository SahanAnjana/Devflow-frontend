import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { JobPostingService } from 'src/app/_services/hr-services/job-posting.service';
import { AddNewJobpostComponent } from './add-new-jobpost/add-new-jobpost.component';

@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.sass'],
})
export class JobPostingComponent {
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  panels: any = [];
  constructor(
    private jobpostingService: JobPostingService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getAllJobPostings();
  }

  getAllJobPostings() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['title'] = '';
    data['department_id'] = '';
    data['active_only'] = '';
    this.jobpostingService.getAllJobpostings(data).subscribe((res: any) => {
      this.panels = res;
    });
  }

  addNewJobPost(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Job Posting',
      nzContent: AddNewJobpostComponent,
      nzFooter: null,
      nzWidth: 606,
      nzClassName: 'add-post',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((result: any) => {
      this.getAllJobPostings();
    });
  }

  editJobPost(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Job Posting',
      nzContent: AddNewJobpostComponent,
      nzFooter: null,
      nzWidth: 606,
      nzClassName: 'add-post',
    });
    modal.componentInstance!.index = index;
    modal.componentInstance!.data = data;
    modal.afterClose.subscribe((result: any) => {
      this.getAllJobPostings();
    });
  }
}
