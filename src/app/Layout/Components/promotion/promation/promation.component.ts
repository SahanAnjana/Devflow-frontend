import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { AddNewPromotionComponent } from '../add-new-promotion/add-new-promotion.component';
import { UpdatePromotionComponent } from '../update-promotion/update-promotion.component';

import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
@Component({
  selector: 'app-promation',
  templateUrl: './promation.component.html',
  styleUrls: ['./promation.component.sass'],
})
export class PromationComponent {
  privileges: any = {
    CORE_SHOW_ADD_PROMOTION: false,
    CORE_SHOW_UPDATE_PROMOTION: false,
  };
  switchValue = false;
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private dataService: DataService,
    private eventTriggerService: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  // viewnewcorporate() {
  //   this.router.navigateByUrl('/user-management/coporate-user');
  // }
  ngOnInit() {
    this.eventTriggerService.onReloadServiceData('privilages');
    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_ADD_PROMOTION') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_ADD_PROMOTION = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_UPDATE_PROMOTION') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_UPDATE_PROMOTION = true)
          : false;
      }
    });
  }
  addnewpromotion() {
    this.modalService.create({
      nzTitle: 'Add New Promotion',
      nzContent: AddNewPromotionComponent,
      nzClassName: 'NewCorporateMainComponent',
      nzFooter: null,
      nzWidth: 720,
    });
  }
  updatepromotion() {
    this.modalService.create({
      nzTitle: 'Update Promotion',
      nzContent: UpdatePromotionComponent,
      nzClassName: 'NewCorporateMainComponent',
      nzFooter: null,
      nzWidth: 720,
    });
  }
}
