import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { ViewProjectComponent } from '../view-project/view-project.component';
import { EditProjectComponent } from '../edit-project/edit-project.component';

@Component({
  selector: 'app-pm-projects',
  templateUrl: './pm-projects.component.html',
  styleUrls: ['./pm-projects.component.sass'],
})
export class PmProjectsComponent {
  allprojects: any;

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  constructor(
    public dataService: DataService,
    private projectsService: ProjectsService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getAllprojects();
  }

  getAllprojects() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['search'] = 'gayan';
    this.projectsService.getALlProjects(data).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.allprojects = res['data'];
        this.totalRecord = res['pagination']['totalItems'];
      }
    });
  }

  addNewProject(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Project',
      nzContent: EditProjectComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-project',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllprojects();
    });
  }
  viewproject(data: any) {
    this.dataService.projectData = data;
    console.log('', this.dataService.projectData.id);
    const modal = this.modalService.create({
      nzTitle: 'View Project',
      nzContent: ViewProjectComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-project',
    });
    modal.componentInstance!.data = data;
    modal.afterClose.subscribe((res: any) => {
      this.getAllprojects();
    });
  }

  editproject(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Project',
      nzContent: EditProjectComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-project',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllprojects();
    });
  }

  deleteproject(id: any) {
    this.projectsService.deleteProjectData(id).subscribe((res: any) => {
      if (res) {
        this.getAllprojects();
      }
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllprojects();
  }
}
