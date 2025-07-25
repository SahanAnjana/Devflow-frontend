import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ResourcesService } from 'src/app/_services/pm-services/resources.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-add-new-resources',
  templateUrl: './add-new-resources.component.html',
  styleUrls: ['./add-new-resources.component.sass'],
})
export class AddNewResourcesComponent {
  public resourcesForm!: FormGroup;
  @Input() data: any;
  @Input() index: any = 'view';

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private modalRef: NzModalRef,
    private notificationService: NzNotificationService,
    private resourcesService: ResourcesService
  ) {}

  ngOnInit() {
    this.resourcesForm = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      cost_rate: [null, Validators.required],
      availability: [null, Validators.required],
      description: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
    });
    if (this.index !== 'create') {
      this.getProgectData();
    }

    if (this.index === 'view') {
      this.resourcesForm.disable();
    }
  }

  get name() {
    return this.resourcesForm.get('name');
  }
  get type() {
    return this.resourcesForm.get('type');
  }
  get cost_rate() {
    return this.resourcesForm.get('cost_rate');
  }
  get availability() {
    return this.resourcesForm.get('availability');
  }
  get description() {
    return this.resourcesForm.get('description');
  }
  get email() {
    return this.resourcesForm.get('email');
  }
  get phone() {
    return this.resourcesForm.get('phone');
  }

  getProgectData() {
    this.resourcesService
      .getResourceDataByid(this.data?.id)
      .subscribe((res: any) => {
        if (res) {
          console.log('res', res['data']['start_date']);
          console.log('res', res['data']['end_date']);
          this.resourcesForm.patchValue({
            name: res['data']['name'],
            type: res['data']['type'],
            cost_rate: res['data']['cost_rate'],
            availability: res['data']['availability'],
            description: res['data']['description'],
            email: res['data']['email'],
            phone: res['data']['phone'],
          });
        }
      });
  }

  createNewresource() {
    if (!this.resourcesForm.valid) {
      return this.validateFormFields(this.resourcesForm);
    } else {
      const formdata = {
        name: this.name?.value,
        type: this.type?.value,
        cost_rate: this.cost_rate?.value,
        availability: this.availability?.value,
        skills: ['string'],
        description: this.description?.value,
        email: this.email?.value,
        phone: this.phone?.value,
        properties: {
          additionalProp1: {},
        },
        project_id: '',
        user_id: this.dataService.userId,
      };
      this.resourcesService
        .cerateNewResources(formdata)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Resources Added Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.modalRef.close();
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'Resources Added Failed',
              { nzStyle: { background: '#8f0505ff', color: '#fff' } }
            );
          }
        });
    }
  }

  updateResources() {
    if (!this.resourcesForm.valid) {
      return this.validateFormFields(this.resourcesForm);
    } else {
      const formdata = {
        name: this.name?.value,
        type: this.type?.value,
        cost_rate: this.cost_rate?.value,
        availability: this.availability?.value,
        skills: ['string'],
        description: this.description?.value,
        email: this.email?.value,
        phone: this.phone?.value,
        properties: {
          additionalProp1: {},
        },
        user_id: this.dataService.userId,
      };
      this.resourcesService
        .updateResourceDataByid(formdata, this.data?.id)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Resources Updated Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.modalRef.close();
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'Resources Updated Failed',
              { nzStyle: { background: '#8f0505ff', color: '#fff' } }
            );
          }
        });
    }
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'name': {
        return 'Name';
      }
      case 'type': {
        return 'Type';
      }
      case 'cost_rate': {
        return 'Cost Rate';
      }
      case 'availability': {
        return 'Availability';
      }
      case 'description': {
        return 'Description';
      }
      case 'email': {
        return 'Email';
      }
      case 'phone': {
        return 'Phone number';
      }
    }
  }

  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.resourcesForm.controls).forEach((field: any) => {
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
}
