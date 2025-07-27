import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssuesService } from 'src/app/_services/pm-services/issues.service';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddNewIssuesComponent } from '../add-new-issues/add-new-issues.component';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.sass'],
})
export class IssuesComponent {
  allIssuesList: any;
  allprojects: any = [];

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  projectId: any;

  constructor(
    public dataService: DataService,
    private issuesService: IssuesService,
    private modalService: NzModalService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.getAllprojects();
    this.getAllIssues();
  }

  getAllIssues() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    // data['project_id'] = ;
    this.issuesService.getALlIssues(data).subscribe((res: any) => {
      if (res['data']) {
        this.allIssuesList = res['data'];
      }
    });
  }

  getProjectId(id: any) {
    this.projectId = id;
    console.log('project id', id);
    this.getAllIssues();
  }

  getAllprojects() {
    const data: any = [];
    this.projectsService.getALlProjects(data).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.allprojects = res['data'];
      }
    });
  }

  createNewIssue(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Issue',
      nzContent: AddNewIssuesComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'create-resources',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllIssues();
    });
  }

  viewIssue(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Issue',
      nzContent: AddNewIssuesComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'create-resources',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllIssues();
    });
  }
  editIssues(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Issue',
      nzContent: AddNewIssuesComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'create-resources',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllIssues();
    });
  }
  deleteIssue(data: any) {
    this.issuesService.deleteIssue(data).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.allprojects = res['data'];
      }
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllIssues();
    this.getAllprojects();
  }
}
