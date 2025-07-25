import { Component, DirectiveDecorator, Input } from '@angular/core';
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
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.sass'],
})
export class UserDetailsComponent {
  public userDetailsGroupForm!: UntypedFormGroup;

  // ngOnInit() {
  //   this.userDetailsGroupForm = this.rootFormFroup.control.get(
  //     this.formGroupName
  //   ) as FormGroup;
  // }
  summary: any;
  nationalityList: any;
  transactionSummaryData: any;
  summaryCcyCode: any;
  constructor(
    private formBuilder: FormBuilder,
    private report: ReportService,
    private notification: NzNotificationService,
    private dataService: DataService,
    private transferService: TransferTabService
  ) {}

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
      firstname: ['', customSelectorRequired('firstname')],
      lastname: ['', customSelectorRequired('lastname')],
      telephonelane: ['', customSelectorRequired('telephonelane')],
      telephonemobile: ['', customSelectorRequired('telephonemobile')],
      residentialaddress: ['', customSelectorRequired('residentialaddress')],
      email: ['', customSelectorRequired('email')],
      city: ['', customSelectorRequired('city')],
      state: ['', customSelectorRequired('state')],
      nationality: ['', customSelectorRequired('nationality')],
      payingby: ['', customSelectorRequired('payingby')],
      postalcode: ['', customSelectorRequired('postalcode')],
      code1: ['', customSelectorRequired('code')],
    });

    this.userDetailsGroupForm.patchValue({
      firstname: this.dataService.transferdata.userFirstName,
      lastname: this.dataService.transferdata.userLastName,
      code1: this.dataService.transferdata.userCountryCode,
      telephonelane: this.dataService.transferdata.userTelephoneMobile,
      telephonemobile: this.dataService.transferdata.userTelephoneMobile,
      email: this.dataService.transferdata.userEmailAddress,
      city: this.dataService.transferdata.userCity,
      state: this.dataService.transferdata.userState,
      residentialaddress: this.dataService.transferdata.userResidentialAddress,
      nationality: this.dataService.transferdata.userNationalityName,
      payingby: this.dataService.transferdata.userPayAs,
      postalcode: this.dataService.transferdata.userPostalCode,
    });

    this.getTransactionVolume();
  }

  get firstname() {
    return this.userDetailsGroupForm.get('firstname');
  }
  get lastname() {
    return this.userDetailsGroupForm.get('lastname');
  }
  get code1() {
    return this.userDetailsGroupForm.get('code');
  }
  get telephonelane() {
    return this.userDetailsGroupForm.get('telephonelane');
  }
  get telephonemobile() {
    return this.userDetailsGroupForm.get('telephonemobile');
  }
  get residentialaddress() {
    return this.userDetailsGroupForm.get('residentialaddress');
  }
  get email() {
    return this.userDetailsGroupForm.get('email');
  }
  get city() {
    return this.userDetailsGroupForm.get('city');
  }
  get state() {
    return this.userDetailsGroupForm.get('state');
  }
  get nationality() {
    return this.userDetailsGroupForm.get('nationality');
  }
  get payingby() {
    return this.userDetailsGroupForm.get('payingby');
  }
  get postalcode() {
    return this.userDetailsGroupForm.get('postalcode');
  }

  getTransactionVolume() {
    const data: any = {};
    data['agentSenderDetailId'] =
      this.dataService.transferdata.agentSenderDetailsId;
    data['sendingCurrencyCode'] = this.dataService.transferdata.currencyCode;
    this.transferService.getsummary(data).subscribe((res) => {
      if (res['responseDto']) {
        this.transactionSummaryData =
          res['responseDto']['0']['customerVolumeDetailsDtos'];
        this.summaryCcyCode = res['responseDto']['0'];
        console.log(this.transactionSummaryData);
      } else {
        this.transactionSummaryData = '';
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notification.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
}
