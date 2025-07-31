import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/_services/pm-services/task.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddNewTaskComponent } from '../add-new-task/add-new-task.component';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { AuthserviceService } from 'src/app/_services/authservice.service';

interface Task {
  title: string;
  // add other properties as needed
  [key: string]: any;
}

interface KanbanColumn {
  title: string;
  status: string;
  tasks: Task[];
}
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.sass'],
})
export class TasksComponent {
  allprojects: any;

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  AllMembers: any = [];
  assigneeChange: any;
  columns: KanbanColumn[] = [
    { title: 'To Do', status: 'to_do', tasks: [] },
    { title: 'In Progress', status: 'in_progress', tasks: [] },
    { title: 'In Review', status: 'in_review', tasks: [] },
    { title: 'Done', status: 'done', tasks: [] },
  ];
  AllprojectTasks: any = [];
  projectId: any;
  status: any;
  assignee: any;

  connectedDropListsIds: string[] = [];

  constructor(
    private taskService: TaskService,
    private modalService: NzModalService,
    private projectsService: ProjectsService,
    private authService: AuthserviceService
  ) {}

  ngOnInit() {
    this.getAllTaskslist();
    this.getAllprojects();
    this.getAllprojectTasks();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      to_do: 'status-todo',
      in_progress: 'status-progress',
      in_review: 'status-review',
      done: 'status-done',
    };
    return statusClasses[status] || 'status-default';
  }

  drop(event: CdkDragDrop<any[]>) {
    const droppedTask = event.previousContainer.data[event.previousIndex];
    console.log('Dropped Task:', droppedTask);

    if (event.previousContainer === event.container) {
      // Same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Different column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.updateEndpoint(droppedTask);
  }

  updateEndpoint(values: any) {
    const data: any = [];

    data['id'] = values.id;

    const formdata: any = {
      status: values.status,
    };
    this.taskService
      .updaterTaskEndpoint(data, formdata)
      .subscribe((res: any) => {
        if (res) {
          this.getAllprojectTasks();
          this.getAllTaskslist();
          this.getAllprojects();
        }
      });
  }

  getAllTaskslist() {
    this.taskService.getAllTaskList().subscribe((res: any) => {
      if (res && res['data']) {
        this.columns = res['data'].map((status: string) => {
          let title = '';
          switch (status) {
            case 'to_do':
              title = 'To Do';
              break;
            case 'in_progress':
              title = 'In Progress';
              break;
            case 'in_review':
              title = 'In Review';
              break;
            case 'done':
              title = 'Done';
              break;
            default:
              title = status;
          }
          return { title, status, tasks: [] };
        });

        this.connectedDropListsIds = this.columns.map(
          (col, i) => `cdk-drop-list-${i}`
        );
      }
    });
  }

  getProjectId(id: any) {
    this.projectId = id;
    console.log('project id', id);
    this.getAllprojectTasks();
    this.getAllMembers(this.projectId);
  }
  getStatus(id: any) {
    this.status = id;
    console.log('project id', id);
    this.getAllprojectTasks();
  }

  changeAssignee(value: any, taskdata: any) {
    this.assignee = value;
    this.assigneechange(taskdata);
  }

  assigneechange(taskdata: any) {
    const data: any = [];
    data['id'] = taskdata.id;
    data['assignee_id'] = this.assignee;
    this.taskService.changeAssigneeEndpoint(data).subscribe((res: any) => {});
  }

  getAllprojectTasks() {
    const data: any = [];
    data['skip'] = 0;
    data['limit'] = 10;
    data['search'] = 'gayan';
    data['project_id'] = this.projectId;
    data['status'] = this.status;
    data['assignee'] = this.assignee;

    this.taskService.getProjectTasks(data).subscribe((res: any) => {
      if (res && res['data']) {
        this.AllprojectTasks = res['data'];
        console.log(this.AllprojectTasks[0]['status']);

        this.columns.forEach((col) => {
          col.tasks = this.AllprojectTasks.filter(
            (task: { status: any }) => task.status === col.status
          );
          console.log(this.columns);
        });
      }
    });
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

  getAllMembers(id: any) {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['id'] = id;
    this.projectsService.getALlmembers(data).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.AllMembers = res['data'];
      }
    });
  }

  addNewTask(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Add Task',
      nzContent: AddNewTaskComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-task',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllprojectTasks();
      this.getAllTaskslist();
      this.getAllprojects();
    });
  }
  editTask(Taskdata: any, index: any) {
    console.log('task data', Taskdata.id);
    const modal = this.modalService.create({
      nzTitle: 'Edit Task',
      nzContent: AddNewTaskComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-task',
    });
    modal.componentInstance!.data = Taskdata;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllprojectTasks();
      this.getAllTaskslist();
      this.getAllprojects();
    });
  }

  viewTask(Taskdata: any, index: any) {
    console.log('task data', Taskdata.id);
    const modal = this.modalService.create({
      nzTitle: 'View Task',
      nzContent: AddNewTaskComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-task',
    });
    modal.componentInstance!.data = Taskdata;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllprojectTasks();
      this.getAllTaskslist();
      this.getAllprojects();
    });
  }

  deleteTask(data: any) {
    this.taskService.deleteTaskDetails(data.id).subscribe((res: any) => {
      if (res) {
        this.getAllprojectTasks();
        this.getAllTaskslist();
        this.getAllprojects();
      }
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllTaskslist();
    this.getAllprojects();
    this.getAllprojectTasks();
  }
}
