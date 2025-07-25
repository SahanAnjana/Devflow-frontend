import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.sass'],
})
export class DiagnosticComponent {
  privileges: any = {
    CORE_SHOW_DIAGNOSTIC_LOGIN_DETAILS: false,
    CORE_SHOW_DIAGNOSTIC_COSTOMER_FOLLOWUP: false,
    CORE_SHOW_DIAGNOSTIC_TRANSFER_FOLLOWUP: false,
    CORE_SHOW_DIAGNOSTIC_DUAL_REGISTRATION: false,
  };
  // diagnosticForm!: FormGroup;
  allPrivilages: any;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private eventTriggerService: EventTriggerService,
    private tokenService: TokenserviceService
  ) {
    this.allPrivilages = this.tokenService.getPrivileges();
  }

  ngOnInit() {
    // this.diagnosticForm = this.fb.group({
    //   dualRegistrationGroup: this.fb.group({
    //     AgentName: [null, []],
    //   }),
    // });
    this.eventTriggerService.onReloadServiceData('privilages');
    console.log('transfer fee calling');
    this.callPrivilageApi();
  }
  callPrivilageApi() {
    this.allPrivilages?.forEach((data: any) => {
      if (data.privilegeCode == 'CORE_SHOW_DIAGNOSTIC_LOGIN_DETAILS') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_DIAGNOSTIC_LOGIN_DETAILS = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_DIAGNOSTIC_COSTOMER_FOLLOWUP') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_DIAGNOSTIC_COSTOMER_FOLLOWUP = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_DIAGNOSTIC_TRANSFER_FOLLOWUP') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_DIAGNOSTIC_TRANSFER_FOLLOWUP = true)
          : false;
      }
      if (data.privilegeCode == 'CORE_SHOW_DIAGNOSTIC_DUAL_REGISTRATION') {
        data.isActive == true
          ? (this.privileges.CORE_SHOW_DIAGNOSTIC_DUAL_REGISTRATION = true)
          : false;
      }
    });
  }
}
