import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-agent-setting-modal',
  templateUrl: './agent-setting-modal.component.html',
  styleUrls: ['./agent-setting-modal.component.sass'],
})
export class AgentSettingModalComponent {
  privileges: any = {
    CORE_SHOW_RATE_SETTINGS_NAV: false,
  };
  type: any;
  mode: any;
  tabIndex = 0;
  public unsubscribe$ = new Subject<void>();
  subAgentPrivilages: any = [];
  allPrivilages: any;

  constructor(
    private subAgentSetting: SubAgentSettingsService,
    private dataService: DataService,
    private eventTriggerService: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_RATE_SETTINGS_NAV') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_RATE_SETTINGS_NAV = true)
          : false;
      }
    });
  }
  next() {
    if (this.tabIndex <= 9) {
      this.tabIndex++;
    } else {
      this.tabIndex = 0;
    }
  }
  change(event: any) {
    this.tabIndex = event;
  }
}
