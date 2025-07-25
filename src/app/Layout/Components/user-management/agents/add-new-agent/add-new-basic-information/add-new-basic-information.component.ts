import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { AddNewAgentComponent } from '../add-new-agent.component';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { AgentService } from 'src/app/_services/agent.service';
import { MakeTransferService } from 'src/app/_services/make-transfer.service';

@Component({
  selector: 'app-add-new-basic-information',
  templateUrl: './add-new-basic-information.component.html',
  styleUrls: ['./add-new-basic-information.component.sass'],
})
export class AddNewBasicInformationComponent {
  @Input() childComponent!: AddNewAgentComponent;
  public basicInformationForm!: FormGroup;
  @Input() formGroupName!: string;
  step = 1;
  countryList: any[] = [];
  currencyList: any[] = [];
  currentStepIndex = 0;
  currentStepStatus1 = 'process';
  currentStepStatus2 = 'wait';
  currentStepStatus3 = 'wait';
  currentStepStatus4 = 'wait';

  constructor(
    private formBuilder: FormBuilder,
    public notificationService: NzNotificationService,
    private rootFormGroup: FormGroupDirective,
    private agentService: AgentService,
    private makeTransferService: MakeTransferService
  ) {}

  ngOnInit(): void {
    
    this.basicInformationForm = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;


    this.getCountry();
    this.getCurrency();
  }
  getCountry() {
    this.agentService.getcountry('MN').subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.countryList = res['responseDto'];
        }
      },
    });
  }
  getCurrency() {
    this.makeTransferService.getCurrency().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.currencyList = res['responseDto'];
        }
      },
    });
  }
}
