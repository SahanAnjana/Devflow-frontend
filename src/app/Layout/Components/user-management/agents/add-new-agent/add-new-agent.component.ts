import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { AgentService } from 'src/app/_services/agent.service';
import { MyValidators } from 'src/app/validators/custom-validators';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-add-new-agent',
  templateUrl: './add-new-agent.component.html',
  styleUrls: ['./add-new-agent.component.sass'],
})
export class AddNewAgentComponent {
  step = 1;
  currentStepIndex = 0;
  currentStepStatus1 = 'process';
  currentStepStatus2 = 'wait';
  currentStepStatus3 = 'wait';
  currentStepStatus4 = 'wait';
  currentUser: any;
  agentForm!: FormGroup;
  agentDetailsId = null;
  documentList: any[] = [];
  next() {
    if (this.step === 1) {
      this.currentStepStatus2 = 'wait';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
      // this.step++;
      // this.currentStepIndex++;

      this.firstStepContinue();
      // } else if (this.step === 2 && !this.dataService.selectedData) {
      //   this.currentStepStatus1 = 'process';
      //   this.currentStepStatus2 = 'process';
      //   this.currentStepStatus3 = 'wait';
      //   this.currentStepStatus4 = 'wait';
      //   // this.step++;
      //   // this.currentStepIndex++;
      //   this.firstStepContinue();
      //   console.log('stp1');
    } else if (this.step === 2 && !this.dataService.selectedData) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
      // this.step++;
      // this.currentStepIndex++;
      console.log('stp2');
      this.secondStepContinue();
    } else if (this.step === 3) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'wait';
      // this.step++;
      // this.currentStepIndex++;
      console.log('stp3');
      this.thidStepContinue();
    } else if (this.step === 4) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'process';
      // this.step++;
      // this.currentStepIndex++;
      console.log('stp4');
      this.finalStep();
    }
  }

  prev() {
    if (this.dataService.selectedData) {
      if (this.step > 1) {
        if (this.step == 3) {
          this.step -= 2;
          this.currentStepIndex -= 2;
        } else {
          this.step--;
          this.currentStepIndex--;
        }
      }
    } else {
      if (this.step > 1) this.step--;
      this.currentStepIndex--;
    }
    // Step changing logic
    if (this.step === 1) {
      this.currentStepStatus2 = 'wait';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
    } else if (this.step === 2) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'wait';
      this.currentStepStatus4 = 'wait';
    } else if (this.step === 3) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'wait';
    } else {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
      this.currentStepStatus4 = 'process';
    }
  }

  close() {
    this.modalRef.close();
  }

  Update() {
    this.finalStep();
    this.currentStepStatus4 = 'process';
  }

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private agentService: AgentService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private modalRef: NzModalRef,
    public dataService: DataService
  ) {
    this.currentUser = this.commonService.parseJwt(tokenService.getToken());
  }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    const {
      customRequired,
      customConfirmPasswordRequired,
      maxLength,
      minLength,
      customEmail,
      customRequiredno,
      contactNumberLength,
      phonenumValidator,
    } = CustomValidators;
    this.agentForm = this.fb.group({
      basicInformation: this.fb.group({
        agentDetailsId: [],
        agentCompanyName: [null, Validators.required],
        agentRegNumber: [null, Validators.required],
        agentName: [null, Validators.required],
        agentCode: [null],
        agentEmail: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(
              // tslint:disable-next-line: max-line-length
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              { has: true }
            ),
          ]),
        ],
        agentRefNumber: [null, Validators.required],
        agentAddress: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/[a-zA-Z ]/, { hasLetter: true }),
          ]),
        ],
        // agentPrimaryContactNo: [null, Validators.required],
        agentPrimaryContactNo: [
          null,
          [customRequiredno('Contact Number'), maxLength(15)],
        ],
        agentSecondaryContactNo: [
          null,
          [customRequiredno('Contact Number'), maxLength(15)],
        ],

        agentBaseCountryId: [null, Validators.required],
        agentBaseCurrencyId: [null, Validators.required],
      }),
      documentation: this.fb.group({
        document: [null, Validators.required],
      }),
      countryFormGroup: this.fb.group({
        baseCountry: [null],
        clientCountryId: this.fb.array([]),
      }),
    });
    this.agentForm.get('countryFormGroup')?.get('baseCountry')?.disable();
    this.patch();
    if (this.dataService.selectedData != null) {
      this.agentForm.get('basicInformation')?.get('agentEmail')?.disable();
    }
  }

  // basicInformationForm
  feildControl(formGroup: any, control: any) {
    return this.agentForm.get(formGroup)?.get(control);
  }

  getFieldName(option: any): any {
    switch (option) {
      // basicInformationForm
      case 'agentCompanyName': {
        return 'Company name';
      }
      case 'agentRegNumber': {
        return 'Registration number';
      }
      case 'agentName': {
        return 'Agent name';
      }
      case 'agentRefNumber': {
        return 'Agent Reference';
      }
      case 'agentEmail': {
        return 'Email address';
      }
      case 'agentAddress': {
        return 'Registered address';
      }
      case 'agentPrimaryContactNo': {
        return 'Primary contact number';
      }
      case 'agentSecondaryContactNo': {
        return 'Secondary contact number';
      }
      case 'agentBaseCountryId': {
        return 'Base country';
      }
      case 'agentBaseCurrencyId': {
        return 'Base Currency';
      }
      case 'document': {
        return 'Document';
      }
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
          control.markAsDirty();
          control.updateValueAndValidity();
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        } else {
          // this.isFieldValid(field);
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  // isFieldValid(field: string) {
  //   if (
  //     !this.basicInformationForm.get(field)!.valid &&
  //     this.basicInformationForm.get(field)!.touched
  //   ) {
  //     this.notificationService.create(
  //       'error',
  //       'Input Error',
  //       'Email must be valid email',
  //       { nzStyle: { background: '#cc2d2d' } }
  //     );
  //   }
  // }

  firstStepContinue() {
    if (!this.agentForm.get('basicInformation')?.valid) {
      this.validateAllFormFields(
        this.agentForm.get('basicInformation') as FormGroup
      );
      return;
    } else {
      console.log('not valid');
      this.saveBasicDetails();
    }
  }

  saveBasicDetails() {
    this.agentForm.get('basicInformation')?.get('agentEmail')?.enable();
    const urlData = {
      clientCode: 'MN',
      loggedUserName: this.currentUser.sub,
      isAgent: this.dataService.selectedData ? null : true,
    };
    this.agentService
      .saveAgent(urlData, this.agentForm.get('basicInformation')?.value)
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.agentDetailsId = res['responseDto'].agentDetailsId;
            this.agentForm
              .get('basicInformation')
              ?.get('agentDetailsId')
              ?.setValue(this.agentDetailsId);
            this.agentForm
              .get('countryFormGroup')
              ?.get('baseCountry')
              ?.setValue(
                this.agentForm
                  .get('basicInformation')
                  ?.get('agentBaseCountryId')?.value
              );
            this.notificationService.create(
              'success',
              'Agent Saved successfully',
              'Success',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            if (this.dataService.selectedData) {
              this.step += 2;
              this.currentStepIndex += 2;
            } else {
              this.step++;
              this.currentStepIndex++;
            }
            this.agentForm
              .get('basicInformation')
              ?.get('agentEmail')
              ?.disable();
          } else {
            this.notificationService.create(
              'error',
              'Input Error',
              res['errorDescription'],
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        },
      });
  }

  secondStepContinue() {
    if (
      !this.agentForm.get('documentation')?.valid ||
      this.agentService.documentList.length < 1
    ) {
      this.validateAllFormFields(
        this.agentForm.get('documentation') as FormGroup
      );
      if (this.agentService.documentList.length < 1) {
        this.notificationService.create(
          'error',
          'Input Error',
          'Document File cannot be empty',
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      }
    } else {
      this.uploadDocument();
    }
  }

  uploadDocument() {
    const data = {};
    let documentList: any = [];

    const list = [
      {
        documentName: 'document1.jpeg',
        documentTypesDto: { documentTypesId: '1' },
      },
    ];
    this.agentService.documentList.forEach((element: any) => {
      // documentList.push({
      //   documentName: element.name,
      //   documentTypesDto: {
      //     documentTypesId: this.agentForm
      //       .get('documentation')
      //       ?.get('document')
      //       ?.value.toString(),
      //   },
      // });
      documentList.push({
        documentName: element.name,
        documentTypesDto: {
          documentTypesId: this.agentForm
            .get('documentation')
            ?.get('document')
            ?.value.toString(),
        },
      });
    });
    let formData = new FormData();
    formData.append('documents', this.agentService.documentList[0]);
    formData.append('documentDetails', JSON.stringify(list));
    this.agentService.uploadDocument(this.agentDetailsId, formData).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.step++;
          this.currentStepIndex++;
          this.notificationService.create(
            'success',
            'Success',
            'Document Saved successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.agentService.documentList = [];
        } else {
          this.notificationService.create(
            'error',
            'Input Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      },
    });
  }
  thidStepContinue() {
    if (
      this.agentService.selectedCountryList.length < 1 &&
      this.agentService.selectedCountryList != null
    ) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Please Select A Sign up Country',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
      return;
    } else {
      this.updateSignUpCountries();
    }
  }

  updateSignUpCountries() {
    const data = {
      agentDetailsId: this.agentDetailsId,
      clientCountryId: this.agentService.selectedCountryList,
    };
    this.agentService.saveSignUpCountries(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.step++;
          this.currentStepIndex++;
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'SignUp Countries Saved successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
          }
          this.agentService.selectedCountryList = [];
        } else {
          this.notificationService.create(
            'error',
            'Input Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      },
    });
  }
  finalStep() {
    if (
      this.agentService.sendingCurrencyList.length < 1 &&
      this.agentService.sendingCurrencyList != null
    ) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Please Select A Sending Currency',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
      return;
    } else if (
      this.agentService.receivingCurrencyList.length < 1 &&
      this.agentService.receivingCurrencyList != null
    ) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Receiving Currencies cannot be empty',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
      return;
    } else {
      this.updateReceivingCurrency();
      this.updateSendingCurrency();
    }
  }
  updateSendingCurrency() {
    const data = {
      agentDetailsId: this.agentDetailsId,
      clientCurrencyId: this.agentService.sendingCurrencyList,
    };
    this.agentService.saveAgentSendingCurrency(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Sending Currency Saved successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.agentService.sendingCurrencyList = [];
          this.close();
        } else {
          this.notificationService.create(
            'error',
            'Input Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      },
    });
  }
  updateReceivingCurrency() {
    const data = {
      agentDetailsId: this.agentDetailsId,
      clientCurrencyId: this.agentService.receivingCurrencyList,
    };
    this.agentService.saveAgentReceivingCurrency(data).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.notificationService.create(
            'success',
            'Success',
            'Receiving Currency Saved successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.agentService.receivingCurrencyList = [];
          this.close();
        } else {
          this.notificationService.create(
            'error',
            'Input Error',
            res['errorDescription'],
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      },
    });
  }

  patch() {
    if (this.dataService.selectedData) {
      this.agentForm.get('basicInformation')?.patchValue({
        agentCompanyName: this.dataService.selectedData.agentCompanyName,
        agentRegNumber: this.dataService.selectedData.agentRegNumber,
        agentName: this.dataService.selectedData.agentName,
        agentRefNumber: this.dataService.selectedData.agentRefNumber,
        agentEmail: this.dataService.selectedData.agentEmail,
        agentAddress: this.dataService.selectedData.agentAddress,
        agentPrimaryContactNo:
          this.dataService.selectedData.agentPrimaryContactNo,
        agentSecondaryContactNo:
          this.dataService.selectedData.agentSecondaryContactNo,
        agentBaseCountryId: this.dataService.selectedData.agentBaseCountryId,
        agentBaseCurrencyId: this.dataService.selectedData.agentBaseCurrencyId,
        agentDetailsId: this.dataService.selectedData.agentDetailsId,
      });
    }
  }
}
