import { Component } from '@angular/core';
import { CommonsService } from 'src/app/_services/commons.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-identity-details',
  templateUrl: './identity-details.component.html',
  styleUrls: ['./identity-details.component.sass'],
})
export class IdentityDetailsComponent {
  privileges: any = {
    CORE_SHOW_SECONDRY_IMAGE: false,
    CORE_SHOW_PRIMARY_IMAGE: false,
  };
  primary: any;
  secondery: any;
  privilegeCodes: any;
  clientData: any;

  ///trmporary services
  privilegeService: any;
  allPrivilages: any;

  constructor(
    // private privilegeService: PrivilegeService,
    private commonsService: CommonsService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService, // added for event trigger service
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    // this.getUserPrivilegeDetails();
    this.eventTriggerService.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_SECONDRY_IMAGE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_SECONDRY_IMAGE = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_PRIMARY_IMAGE') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_PRIMARY_IMAGE = true)
          : false;
      }
    });
  }

  getUserPrivilegeDetails() {
    this.clientData = this.commonsService.parseJwt(
      localStorage.getItem('currentUser')
    );
    const data = this.clientData.sub;

    this.privilegeService.getUserPrivilegeData(data).subscribe((res: any) => {
      this.privilegeCodes = res['responseDto'];

      if (this.privilegeCodes.includes('CORE_SHOW_SECONDRY_IMAGE')) {
        this.secondery = this.privilegeCodes.includes(
          'CORE_SHOW_SECONDRY_IMAGE'
        );
      }
      if (this.privilegeCodes.includes('CORE_SHOW_PRIMARY_IMAGE')) {
        this.primary = this.privilegeCodes.includes('CORE_SHOW_PRIMARY_IMAGE');
      }
    });
  }
}
