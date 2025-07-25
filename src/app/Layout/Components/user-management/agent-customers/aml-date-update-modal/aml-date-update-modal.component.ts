import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';

@Component({
  selector: 'app-aml-date-update-modal',
  templateUrl: './aml-date-update-modal.component.html',
  styleUrls: ['./aml-date-update-modal.component.sass'],
})
export class AmlDateUpdateModalComponent {
  public amlUpdateForm!: FormGroup;
  receivedCustomerData: any;
  clientPaymentModeDto: any;
  amlCheckDate: any;

  @Input() mode: any = {};
  @Input() type!: 'view';

  todayDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private modalRef: NzModalRef,
    private dataService: DataService,
    private corporateService: CoperateuserService,
    private agentCustomerDataService: AgentCustomerService // private eventTriggerService: EventTriggerService, // private coporateSenderDataService: CoporateSenderDataService
  ) {}

  ngOnInit() {
    this.amlUpdateForm = this.formBuilder.group({
      amlDate: [null, Validators.required],
    });
    if (this.dataService.clickEventStatus == 'fromAgentCustomer') {
      this.receivedCustomerData = this.dataService.selectedData;
    } else if (this.dataService.clickEventStatus == 'fromCoporateUsers') {
      this.receivedCustomerData = this.mode;
    }
    // this.receivedCustomerData = this.dataService.selectedData;
    console.log('mail', this.receivedCustomerData);
  }

  get amlDate() {
    return this.amlUpdateForm.get('amlDate');
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
            { nzStyle: { background: '#cc2d2d' } }
          );
        } else {
          // this.isFieldValid(field);
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'amlDate': {
        return 'Date';
      }
    }
  }

  disabledPastDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) < 0;
  };

  submit() {
    // console.log( this.dataService.selectedData);
    if (!this.amlUpdateForm.valid) {
      this.validateAllFormFields(this.amlUpdateForm);
    } else {
      const data: any = {};
      data['email'] = this.dataService.selectedData;
      data['amlCheckDate'] = format(this.amlDate?.value, 'yyyy-MM-dd');

      this.agentCustomerDataService.updateAML(data).subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'Date updated successfully',
              { nzStyle: { background: '#00A03E' } }
            );
            this.closeModal();
          } else {
            this.notificationService.create(
              'error',
              'Error',
              res['errorDescription'],
              { nzStyle: { background: '#cc2d2d' } }
            );
          }
        },
      });
      // if (this.dataService.clickEventStatus === 'fromAgentCustomer') {
      //   // this.agentCustomerDataService.updateAgentCustomerAMLDate(data).subscribe((res:any) => {
      //   //   if (res['responseDto']) {
      //   //     this.eventTriggerService.onReloadServiceData();
      //   //     this.notificationService.create('success','Success', 'Date updated successfully',{nzStyle:{background:'#00A03E'}});
      //   //     this.closeModal();
      //   //   }
      //   // },
      //   //   () => {
      //   //     this.notificationService.create('error','Error', 'Date update failed',{nzStyle:{background:'#cc2d2d'}});
      //   //   });
      // } else {
      //   // this.coporateSenderDataService.updateCoporateSenderAMLDate(data).subscribe((res:any) => {
      //   //   if (res['responseDto']) {
      //   //     this.eventTriggerService.onReloadServiceData();
      //   //     this.notificationService.create('success','Success', 'Date updated successfully',{nzStyle:{background:'#00A03E'}});
      //   //     this.closeModal();
      //   //   }
      //   // },
      //   //   () => {
      //   //     this.notificationService.create('error','Error', 'Date update failed',{nzStyle:{background:'#cc2d2d'}});
      //   //   });
      // }
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }

  updateAml() {
    console.log(this.receivedCustomerData);

    if (!this.amlUpdateForm.valid) {
      this.validateAllFormFields(this.amlUpdateForm);
    } else {
      const data: any = {};

      data['email'] = this.receivedCustomerData.email;

      data['amlCheckDate'] = this.amlDate!.value
        ? format(this.amlDate!.value, 'yyyy-MM-dd')
        : null;

      this.corporateService.updateAML(data).subscribe({
        next: (res) => {
          if (res['responseDto'] != null) {
            this.createNotifications(
              'success',
              'AML Date Updated Successfully',
              '#F45300',
              'Success'
            );
            this.close();
            this.receivedCustomerData = null;
          } else {
            this.receivedCustomerData = null;
            this.createNotifications(
              'Error',
              res['errorDescription'],
              '#F45300',
              'Error'
            );
          }
        },
      });
    }
  }

  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    // console.log('createNotification');
    // title: string, message: string
    this.notificationService.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }

  close() {
    this.modalRef.close();
  }
}
