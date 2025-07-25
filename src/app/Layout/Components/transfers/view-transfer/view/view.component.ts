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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent {
  @Input() formGroupName!: string;

  public viewTransferGroupForm!: UntypedFormGroup;

  // ngOnInit(): void {
  //   this.viewTransferGroupForm = this.rootFormFroup.control.get(
  //     this.formGroupName
  //   ) as FormGroup;
  // }
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService
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

    this.viewTransferGroupForm = this.formBuilder.group({
      amounttobesent: [null],
      transferas: [null],
      recipientcurrency: [null],
      sendingcurrency: [null],
      beneficiarywillreceive: [null],
      totalamountpayable: [null],
      promocode: [null],
    });

    this.viewTransferGroupForm.patchValue({
      amounttobesent: this.dataService.transferdata.sentAmount.toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ),
      transferas: this.dataService.transferdata.transferAs,
      recipientcurrency: this.dataService.transferdata.recipientCurrency,
      sendingcurrency: this.dataService.transferdata.sendingCurrency,
      beneficiarywillreceive:
        this.dataService.transferdata.beneficiaryAmountReceive.toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
      totalamountpayable:
        this.dataService.transferdata.totalAmountPayable.toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
      promocode: this.dataService.transferdata.promoCode,
    });
  }

  get amounttobesent() {
    return this.viewTransferGroupForm.get('amounttobesent');
  }
  get transferas() {
    return this.viewTransferGroupForm.get('transferas');
  }
  get recipientcurrency() {
    return this.viewTransferGroupForm.get('recipientcurrency');
  }
  get sendingcurrency() {
    return this.viewTransferGroupForm.get('sendingcurrency');
  }
  get beneficiarywillreceive() {
    return this.viewTransferGroupForm.get('beneficiarywillreceive');
  }
  get totalamountpayable() {
    return this.viewTransferGroupForm.get('totalamountpayable');
  }
}
