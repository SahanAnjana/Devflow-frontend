import { Component, DirectiveDecorator, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  UntypedFormGroup,
} from '@angular/forms';

import { CustomValidators } from 'src/app/_helpers/custom-validators';
import { DataService } from 'src/app/_services/shared-data/data.service';
@Component({
  selector: 'app-report-view-transfer',
  templateUrl: './report-view-transfer.component.html',
  styleUrls: ['./report-view-transfer.component.sass'],
})
export class ReportViewTransferComponent {
  @Input() formGroupName!: string;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {}
  reportform!: UntypedFormGroup;
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

    this.reportform = this.formBuilder.group({
      amounttobesent: [null],
      transferas: [null],
      recipientcurrency: [null],
      sendingcurrency: [null],
      beneficiarywillreceive: [null],
      totalamountpayable: [null],
    });

    this.reportform.patchValue({
      amounttobesent: this.dataService.reportdata.sentAmount.toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ),
      transferas: this.dataService.reportdata.transferAs,
      recipientcurrency: this.dataService.reportdata.recipientCurrency,
      sendingcurrency: this.dataService.reportdata.sendingCurrency,
      beneficiarywillreceive:
        this.dataService.reportdata.beneficiaryAmountReceive,
      totalamountpayable:
        this.dataService.reportdata.totalAmountPayable.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    });
  }

  get amounttobesent() {
    return this.reportform.get('amounttobesent');
  }
  get transferas() {
    return this.reportform.get('transferas');
  }
  get recipientcurrency() {
    return this.reportform.get('recipientcurrency');
  }
  get sendingcurrency() {
    return this.reportform.get('sendingcurrency');
  }
  get beneficiarywillreceive() {
    return this.reportform.get('beneficiarywillreceive');
  }
  get totalamountpayable() {
    return this.reportform.get('totalamountpayable');
  }
}
