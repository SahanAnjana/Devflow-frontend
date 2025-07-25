import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { WarningOutline } from '@ant-design/icons-angular/icons';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@NgModule({
  declarations: [],
  imports: [CommonModule, NzIconModule.forRoot([WarningOutline])],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCardModule,
    NzGridModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDividerModule,
    NzToolTipModule,
    NzSelectModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzModalModule,
    NzNotificationModule,
    NzLayoutModule,
    NzMenuModule,
    NzStatisticModule,
    NzMessageModule,
    NzPaginationModule,
    NzRadioModule,
    NzListModule,
    NzTableModule,
    NzPopconfirmModule,
    NzIconModule,
    NzTabsModule,
    NzSwitchModule,
    NzBadgeModule,
    NzAvatarModule,
    NzProgressModule,
    NzCalendarModule,
    NzStepsModule,
    NzPageHeaderModule,
    NzCollapseModule,
    NzUploadModule,
    NzSpaceModule,
    NzToolTipModule,
    AngularEditorModule,
    DragDropModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzAlertModule,
    NzTagModule,
    NzEmptyModule,
  ],
})
export class SharedModule { }
