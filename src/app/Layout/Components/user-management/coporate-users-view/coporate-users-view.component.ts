import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-coporate-users-view',
  templateUrl: './coporate-users-view.component.html',
  styleUrls: ['./coporate-users-view.component.sass'],
})
export class CoporateUsersViewComponent {
  @Input() mode: any = {};
  @Input() coorporateId: any;

  agentUserCooperateID: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  newCorpUserDetails: any;
  companyName: any;
  companyRegNumber: any;
  phoneCode: any;
  telephoneNumber: any;
  mobileCode: any;
  mobileNumber: any;
  email: any;
  address: any;
  companyCity: any;
  companyPostalCode: any;
  amlCheckDate: any;
  refCode: any;
  registerDate: any;
  registerFrom: any;

  ngOnInit() {
    console.log(this.mode);

    this.agentUserCooperateID = this.mode.agentUserCooperateId;
  }
}
