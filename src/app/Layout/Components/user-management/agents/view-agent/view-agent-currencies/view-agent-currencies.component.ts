import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { UserManagementAgentService } from 'src/app/_services/user-management-agent.service';

@Component({
  selector: 'app-view-agent-currencies',
  templateUrl: './view-agent-currencies.component.html',
  styleUrls: ['./view-agent-currencies.component.sass']
})
export class ViewAgentCurrenciesComponent {
  exposableId: any;
  countryData: any;
  currencydata: any;
  constructor(
    private modalService: NzModalService,
    private dataService: DataService,
    private agent: DataService,
    private agentService: UserManagementAgentService,
    
  ) {}

ngOnInit() {
  this.exposableId = this.dataService.agentExposableId;
  this.getAllrecevingcurrencies();
  this.getAllsendingcurrencies();
}
  getAllrecevingcurrencies() {
    const data: any = {};
    data['exposableId'] = 'wOzOy5dfT89'; //this.dataService.agentExposableId;
    this.agentService.getAllreceivingcurrencies(data).subscribe((res) => {
      if (res['responseDto']) {
        this.countryData = res['responseDto'];
      } else {
        this.countryData = [];
      }
    });
  }
  getAllsendingcurrencies() {
    const data: any = {};
    data['exposableId'] = 'FJwAeEbjUMp'; //this.dataService.agentExposableId;
    this.agentService.getAllreceivingcurrencies(data).subscribe((res) => {
      if (res['responseDto']) {
        this.currencydata = res['responseDto'];
      } else {
        this.currencydata = [];
      }
    });
  }
}
