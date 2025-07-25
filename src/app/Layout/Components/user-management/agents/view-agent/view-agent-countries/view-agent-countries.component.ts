import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { UserManagementAgentService } from 'src/app/_services/user-management-agent.service';

@Component({
  selector: 'app-view-agent-countries',
  templateUrl: './view-agent-countries.component.html',
  styleUrls: ['./view-agent-countries.component.sass']
})
export class ViewAgentCountriesComponent {
  exposableId: any;
  countryData: any;
  constructor(
    private modalService: NzModalService,
    private dataService: DataService,
    private agent: DataService,
    private agentService: UserManagementAgentService,
    
  ) {}

ngOnInit() {
  this.exposableId = this.dataService.agentExposableId;
  this.getAllCountries();
}
  


  getAllCountries() {
    const data: any = {};
    data['exposableId'] = 'GyHkvGOs13g'; //this.dataService.agentExposableId;
    this.agentService.getAllSignUpCountries(data).subscribe((res) => {
      if (res['responseDto']) {
        this.countryData = res['responseDto'];
      } else {
        this.countryData = [];
      }
    });
  }
}
