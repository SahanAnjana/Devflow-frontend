import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';
import { MyValidators } from 'src/app/validators/custom-validators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-transfer-amount',
  templateUrl: './transfer-amount.component.html',
  styleUrls: ['./transfer-amount.component.sass'],
})
export class TransferAmountComponent {
  @Input() mode: any;
  @Input() type: any;
  amount: any;

  constructor(
    private transferService: TransferTabService,
    private eventTrigger: EventTriggerService,
    private modalref: NzModalRef,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService
  ) {}

  transferamount!: FormGroup;
  ngOnInit() {
    const { customRequired, maxLength, minLength, email, pattern } =
      MyValidators;
    this.transferamount = this.fb.group({
      sendingamount: [null, [customRequired('sendingamount ')]],
    });

    console.log(this.mode);
    this.patchData();
  }

  patchData() {
    if (this.type == 'sendAmount') {
      console.log('type send');
      this.amount = this.mode.totalPayable;
      setTimeout(() => {
        this.transferamount.patchValue({
          sendingamount: this.amount.toFixed(2).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        });
      }, 200);
    }
    if (this.type == 'receivedAmount') {
      console.log('type receive');
      this.amount = this.mode.receivingAmount;
      setTimeout(() => {
        this.transferamount.patchValue({
          sendingamount: this.amount.toFixed(2).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        });
      }, 200);
    }
  }
  getFieldName(option: any): any {
    switch (option) {
      case 'sendingamount': {
        return 'sendingamount';
      }
    }
  }

  get sendingamount() {
    return this.transferamount.get('sendingamount');
  }
  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.transferamount.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        }
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    });
  }
  update() {
    if (!this.transferamount.valid) {
      this.validateFormFields(this.transferamount);
      return;
    }
    if (this.type == 'sendAmount') {
      this.updateSendingAmount();
    } else {
      this.updateReceivingAmount();
    }
  }

  updateSendingAmount() {
    const data: any = {};
    data['newSendingAmount'] = this.sendingamount?.value;
    data['transactionMasterId'] = this.mode.transactionMasterId;
    data['transactionDetailId'] = this.mode.transactionDetailId;
    return this.transferService.ammendSendAmount(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'Sending Amount Updated successfully',
          '#ffffff',
          '#00A03E'
        );
        this.eventTrigger.onReloadServiceData('amount');
        this.close();
      } else {
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

  updateReceivingAmount() {
    const data: any = {};
    data['newReceivingAmount'] = this.sendingamount?.value;
    data['transactionMasterId'] = this.mode.transactionMasterId;
    data['transactionDetailId'] = this.mode.transactionDetailId;
    return this.transferService
      .ammendReceivedAmount(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.createNotification(
            'success',
            'Success',
            'Receiving Amount Updated successfully',
            '#ffffff',
            '#00A03E'
          );
          this.eventTrigger.onReloadServiceData('amount');
          this.close();
        } else {
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
  close() {
    this.modalref.destroy();
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
