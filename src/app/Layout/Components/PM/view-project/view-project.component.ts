import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { endOfDay } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.sass'],
})
export class ViewProjectComponent {
  @Input() data: any;
  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private notificationService: NzNotificationService,
    private modalRef: NzModalRef
  ) {}
}
