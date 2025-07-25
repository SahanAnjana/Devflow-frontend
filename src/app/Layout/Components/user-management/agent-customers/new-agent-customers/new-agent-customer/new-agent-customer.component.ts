import {
  Component,
  AfterViewInit,
  ViewChild,
  ContentChild,
  ElementRef,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { SignupComponent } from 'src/app/Layout/Components/signup/signup/signup.component';

@Component({
  selector: 'app-new-agent-customer',
  templateUrl: './new-agent-customer.component.html',
  styleUrls: ['./new-agent-customer.component.sass'],
})
export class NewAgentCustomerComponent {
  privileges: any = {
    CORE_SHOW_AGENT_CUSTOMER_NEW: false,
  };
  activeTab: string = 'Approval Pending Agent Customers';
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,
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
      if (data.privilegeCode == 'CORE_SHOW_AGENT_CUSTOMER_NEW') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_AGENT_CUSTOMER_NEW = true)
          : false;
      }
    });
  }

  addAgentCustomer() {
    this.modalService.create({
      nzTitle: 'Sign Up',
      nzContent: SignupComponent,
      nzFooter: null,
      nzClassName: 'signup',
      nzCentered: true,
    });
  }
}
