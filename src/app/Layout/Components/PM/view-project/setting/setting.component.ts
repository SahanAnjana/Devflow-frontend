import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.sass'],
})
export class SettingComponent {
  settingForm!: FormGroup;
  allSettings: any = [];

  constructor(
    private dataService: DataService,
    private projectService: ProjectsService,
    private modalService: NzModalService,
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService
  ) {}
  ngOnInit() {
    console.log('working');
    this.getAllsettings();
  }

  groupedSettings: any[][] = [];

  getAllsettings() {
    this.projectService
      .getALlsettings(this.dataService.projectData.id)
      .subscribe((res: any) => {
        if (res && res.data) {
          const data = res.data;

          const booleanSettings = Object.keys(data)
            .filter((key) => typeof data[key] === 'boolean')
            .map((key) => ({
              name: key,
              isActive: data[key],
            }));

          if (data.visibility) {
            booleanSettings.push({
              name: 'visibility',
              isActive: data.visibility === 'public',
            });
          }

          this.allSettings = booleanSettings;

          // Group into chunks of 3
          this.groupedSettings = [];
          for (let i = 0; i < this.allSettings.length; i += 3) {
            this.groupedSettings.push(this.allSettings.slice(i, i + 3));
          }
        }
      });
  }

  onChange(settingKey: string, value: boolean) {
    const formdata: any = {};

    if (settingKey === 'visibility') {
      formdata[settingKey] = value ? 'public' : 'private';
    } else {
      formdata[settingKey] = value;
    }

    this.projectService
      .updatesettings(formdata, this.dataService.projectData.id)
      .subscribe((res: any) => {
        if (res && res.data) {
          console.log('res', res);
        }
      });
  }
}
