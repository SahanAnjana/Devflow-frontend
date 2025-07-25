import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';

import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { ReportService } from 'src/app/_services/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-report-view-userdetails',
  templateUrl: './report-view-userdetails.component.html',
  styleUrls: ['./report-view-userdetails.component.sass'],
})
export class ReportViewUserdetailsComponent {
  // nationality: any;
  summary: any;
  nationalityList: any;
  constructor(
    private formBuilder: FormBuilder,
    private report: ReportService,

    private dataService: DataService
  ) {}
  reportuserdetails!: UntypedFormGroup;
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

    this.reportuserdetails = this.formBuilder.group({
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
    });

    this.reportuserdetails.patchValue({
      firstname: this.dataService.reportdata.userFirstName,
      lastname: this.dataService.reportdata.userLastName,
      telephonelane: this.dataService.reportdata.userTelephoneMobile,
      telephonemobile: this.dataService.reportdata.userTelephoneMobile,
      email: this.dataService.reportdata.userEmailAddress,
      city: this.dataService.reportdata.userCity,
      state: this.dataService.reportdata.userState,
      residentialaddress: this.dataService.reportdata.userResidentialAddress,
      nationality: this.dataService.reportdata.userNationalityName,
      payingby: this.dataService.reportdata.userPayAs,
      postalcode: this.dataService.reportdata.userPostalCode,
    });
    // this.getnationality();
    // this.getsummary();
  }

  get firstname() {
    return this.reportuserdetails.get('firstname');
  }
  get lastname() {
    return this.reportuserdetails.get('lastname');
  }
  get telephonelane() {
    return this.reportuserdetails.get('telephonelane');
  }
  get telephonemobile() {
    return this.reportuserdetails.get('telephonemobile');
  }
  get residentialaddress() {
    return this.reportuserdetails.get('residentialaddress');
  }
  get email() {
    return this.reportuserdetails.get('email');
  }
  get city() {
    return this.reportuserdetails.get('city');
  }
  get state() {
    return this.reportuserdetails.get('state');
  }
  get nationality() {
    return this.reportuserdetails.get('nationality');
  }
  get payingby() {
    return this.reportuserdetails.get('payingby');
  }
  get postalcode() {
    return this.reportuserdetails.get('postalcode');
  }
  getnationality() {
    this.report.getnationality().subscribe((res) => {
      this.nationalityList = res['responseDto'];

      const beneficiaryNationalityDetail =
        this.dataService.reportdata.userNationalityName;
      const selectedNationality = this.nationalityList.find(
        (nat: { nationality: any }) =>
          nat.nationality === beneficiaryNationalityDetail
      );
      this.reportuserdetails.patchValue({
        nationality: selectedNationality
          ? selectedNationality.nationality
          : null,
      });
    });
  }
}
