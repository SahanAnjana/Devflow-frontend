import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  UntypedFormGroup,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
@Component({
  selector: 'app-view-agent-basic',
  templateUrl: './view-agent-basic.component.html',
  styleUrls: ['./view-agent-basic.component.sass'],
})
export class ViewAgentBasicComponent {
  public userDetailsGroupForm!: UntypedFormGroup;
  constructor(
    private modalService: NzModalService,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}
  receciveddata: any;
  ngOnInit() {
    const {
      required,
      customSelectorRequired,
      customRequired,
      maxLength,
      minLength,
      customEmail,
      pattern,
    } = CustomValidators;

    this.userDetailsGroupForm = this.formBuilder.group({
      companyname: ['', customSelectorRequired('companyname')],
      registerno: ['', customSelectorRequired('registerno')],
      agentname: ['', customSelectorRequired('agentname')],
      agentreference: ['', customSelectorRequired('agentreference')],
      registeredaddress: ['', customSelectorRequired('residentialaddress')],
      email: ['', customSelectorRequired('email')],
      primarycontactno: ['', customSelectorRequired('primarycontactno')],
      secondarycontactno: ['', customSelectorRequired('secondarycontactno')],
      nationality: ['', customSelectorRequired('nationality')],
      basecountry: ['', customSelectorRequired('basecountry')],
      basecurrency: ['', customSelectorRequired('basecurrency')],
    });
    this.receciveddata = this.dataService.selectedData;
    this.userDetailsGroupForm?.get('agentEmail')?.disable();
    this.userDetailsGroupForm.patchValue({
      companyname: this.receciveddata.agentCompanyName,
      registerno: this.receciveddata.agentRegNumber,
      agentname: this.receciveddata.agentName,
      agentreference: this.receciveddata.agentRefNumber,
      email: this.receciveddata.agentEmail,
      registeredaddress: this.receciveddata.agentAddress,
      primarycontactno: this.receciveddata.agentPrimaryContactNo,
      secondarycontactno: this.receciveddata.agentSecondaryContactNo,
      basecountry: this.receciveddata.agentCompanyName,
      basecurrency: this.receciveddata.agentCompanyName,
    });
  }
}
