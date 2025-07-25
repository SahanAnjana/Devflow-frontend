import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BeneficiaryTransactionComponent } from '../beneficiary-transaction/beneficiary-transaction.component';
import { ViewBeneficiariesDetailsComponent } from './view-beneficiaries-details/view-beneficiaries-details.component';

import { AddBeneficiariesComponent } from '../add-beneficiaries/add-beneficiaries.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { CommonsService } from 'src/app/_services/commons.service';
import { PendingcashService } from 'src/app/_services/pendingcash.service';
import { RolemanagementService } from 'src/app/_services/rolemanagement.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.sass'],
})
export class BeneficiariesComponent {
  privileges: any = {
    CORE_SHOW_ADD_NEW_BENEFICIARY: false,
    CORE_SHOW_BENEFICIARY_STATUS_BUTTON: false,
    CORE_SHOW_BENEFICIARY_EDIT: false,
    CORE_SHOW_BENEFICIARY_VIEW_REPORT: false,
  };
  switchValue = false;
  pageNumber = 1;
  pageSize = 10;
  destroy$: Subject<boolean> = new Subject<boolean>();
  benificiaryDetails: any;
  totalRecords: any;
  benificiaryDetailsId: any;
  currentPageIndex = 1;
  name: any;
  contactNumber: any;
  address: any;
  allPrivilages: any;

  constructor(
    private modalService: NzModalService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private benificiaryService: BenificiaryService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private eventTriggerService: EventtriggerService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'onBankSave') {
          this.getAllBenificiaryData();
        }
      },
    });
    this.getAllBenificiaryData();
    this.eventTriggerService.onReloadServiceData('privilages');

    this.callPrivilageApi();
  }

  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_ADD_NEW_BENEFICIARY') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_ADD_NEW_BENEFICIARY = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_BENEFICIARY_STATUS_BUTTON') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_BENEFICIARY_STATUS_BUTTON = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_BENEFICIARY_EDIT') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_BENEFICIARY_EDIT = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_BENEFICIARY_VIEW_REPORT') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_BENEFICIARY_VIEW_REPORT = true)
          : false;
      }
    });
  }

  viewnewcorporate(type: any, mode: any) {
    const model = this.modalService.create({
      nzTitle: 'Beneficiary Transcation',
      nzContent: BeneficiaryTransactionComponent,
      nzClassName: 'agent-privillage-settings',
      nzFooter: null,
    });
    model.componentInstance!.type = type;
    model.componentInstance!.mode = mode;
    model.afterClose.subscribe({
      next: () => {
        this.getAllBenificiaryData();
      },
    });
  }

  viewbeneficiariesdetails(type: any, mode: any) {
    const model = this.modalService.create({
      nzTitle: 'View/Edit Beneficiary Details',
      nzContent: ViewBeneficiariesDetailsComponent,
      // nzClassName: 'agent-privillage-settings',
      nzWidth: 1012,
      nzFooter: null,
    });
    model.componentInstance!.type = type;
    model.componentInstance!.mode = mode;
    model.afterClose.subscribe({
      next: () => {
        this.getAllBenificiaryData();
      },
    });
  }

  addnewbeneficiaries() {
    this.modalService.create({
      nzTitle: 'Add Beneficiary',
      nzContent: AddBeneficiariesComponent,
      // nzClassName: 'agent-privillage-settings',
      nzWidth: 1012,
      nzFooter: null,
    });
  }

  getAllBenificiaryData() {
    const data: any = {};

    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['name'] = this.name;
    data['address'] = this.address;
    data['contactNumber'] = this.contactNumber;

    this.benificiaryService
      .getAllBenificiaryData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.benificiaryDetails = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
            this.benificiaryDetailsId =
              res['responseDto']['payload']['agentBeneficiaryId'];
            this.dataService.benificiaryDetailsID = this.benificiaryDetailsId;
          } else {
            this.benificiaryDetails = [];
            this.totalRecords = 0;
          }
        },
      });
    console.log('myid', this.benificiaryDetailsId);
  }

  toggleSwitch(receivedData: any) {
    const data: any = {};

    data['agentBeneficiaryId'] = receivedData.agentBeneficiaryId;
    data['isActive'] = !receivedData.isActive;

    console.log('beniId', this.benificiaryDetailsId);

    this.benificiaryService.updateAgentBeneficiaryStatus(data).subscribe(
      (res: any) => {
        if (res['status'] == true) {
          this.notificationService.create(
            'success',
            'Success',
            'Agent Beneficiary Status Updated.',
            { nzStyle: { background: '#00A03E', color: '#ffff' } }
          );
        }
        this.getAllBenificiaryData();
      },
      () => {
        this.notificationService.create(
          'error',
          'Error',
          'Agent Benificiery Status Updating Failed',
          { nzStyle: { background: '#cc2d2d', color: '#ffff' } }
        );
      }
    );
  }

  resetNameFilter() {
    this.name = null;
    this.getAllBenificiaryData();
  }
  resetContactFilter() {
    this.contactNumber = null;
    this.getAllBenificiaryData();
  }
  resetAddressFilter() {
    this.address = null;
    this.getAllBenificiaryData();
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllBenificiaryData();
  }

  getBasicData(agentBeneficiaryId: any) {
    const data: any = {};
    data['benificiaryid'] = agentBeneficiaryId;
    this.benificiaryService
      .getBasicData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            const coporateUser = res['responseDto']['isCorporate'];
          }
        },
      });
  }
}
