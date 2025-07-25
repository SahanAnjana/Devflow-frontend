import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';
import { MyValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-view-approval-pending-sub-agent',
  templateUrl: './view-approval-pending-sub-agent.component.html',
  styleUrls: ['./view-approval-pending-sub-agent.component.sass'],
})
export class ViewApprovalPendingSubAgentComponent {
  value?: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  agent_data: any;
  subAgentForm!: FormGroup;
  subAgentNameData: any = [];
  subagentName: any;
  todayDate = new Date();
  exposableId: any;
  edit = false;
  receivedSubAgentData: any;

  autoTips: Record<string, Record<string, string>> = {
    en: {},
    default: {},
  };
  public unsubscribe$ = new Subject<void>();
  @Input() mode: any = {};
  @Input() type: any;

  viewSubAgentData: any = [];

  constructor(
    private modalref: NzModalRef,
    private subAgentSetting: SubAgentSettingsService,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const { customRequired, customEmail, pattern, minLength, maxLength } =
      MyValidators;
    this.subAgentForm = this.fb.group({
      subAgentName: [null, Validators.required],
      agentName: [null, Validators.required],
      reference: [null, Validators.required],
      email: [null, Validators.required],
      address: [null, Validators.required],
      regDate: [null, Validators.required],
      primaryConNo: [null, Validators.required],
      secondaryConNo: [null, Validators.required],
      baseCountry: [null, Validators.required],
      baseCurrency: [null, Validators.required],
    });

    this.getSelectedSubAgentData();
    this.subAgentForm.disable();
  }

  get subAgentName() {
    return this.subAgentForm.get('subAgentName');
  }
  get agentName() {
    return this.subAgentForm.get('agentName');
  }
  get agentRefNumber() {
    return this.subAgentForm.get('reference');
  }
  get email() {
    return this.subAgentForm.get('email');
  }
  get agentAddress() {
    return this.subAgentForm.get('address');
  }
  get agentRegisteredDate() {
    return this.subAgentForm.get('regDate');
  }
  get agentPrimaryContactNo() {
    return this.subAgentForm.get('primaryConNo');
  }
  get agentSecondaryContactNo() {
    return this.subAgentForm.get('secondaryConNo');
  }
  get agentBaseCountryName() {
    return this.subAgentForm.get('baseCountry');
  }
  get agentBaseCurrencyName() {
    return this.subAgentForm.get('baseCurrency');
  }

  getSelectedSubAgentData() {
    this.receivedSubAgentData = this.dataService.selectedData;
    console.log(this.dataService.selectedData);

    this.subAgentForm.patchValue({
      subAgentName: this.receivedSubAgentData.subAgentName,
      agentName: this.dataService.subAgentPendingData.agentName,
      reference: this.receivedSubAgentData.agentRefNumber,
      email: this.receivedSubAgentData.agentEmail,
      address: this.receivedSubAgentData.agentAddress,
      regDate: this.receivedSubAgentData.agentRegisteredDate,
      primaryConNo: this.receivedSubAgentData.agentPrimaryContactNo,
      secondaryConNo: this.receivedSubAgentData.agentSecondaryContactNo,
      baseCountry: this.receivedSubAgentData.agentBaseCountryName,
      baseCurrency: this.receivedSubAgentData.agentBaseCurrencyName,
    });
  }
}
