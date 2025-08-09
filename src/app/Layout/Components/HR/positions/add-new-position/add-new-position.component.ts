import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PositionsService } from 'src/app/_services/hr-services/positions.service';

@Component({
  selector: 'app-add-new-position',
  templateUrl: './add-new-position.component.html',
  styleUrls: ['./add-new-position.component.sass'],
})
export class AddNewPositionComponent {
  public addPositionForm!: FormGroup;
  showFields: boolean = false;
  @Input() data: any;
  @Input() index: any;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private positionService: PositionsService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit() {
    this.addPositionForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      minsalary: ['', [Validators.required]],
      mixsalary: ['', [Validators.required]],
      created_at: ['', [Validators.required]],
      updated_at: ['', [Validators.required]],
    });

    if (this.index === 'create') {
      this.showFields = false;
    } else {
      this.showFields = true;
      this.addPositionForm.get('created_at')?.setValidators([]);
      this.addPositionForm.get('created_at')?.updateValueAndValidity();
      this.addPositionForm.get('updated_at')?.setValidators([]);
      this.addPositionForm.get('updated_at')?.updateValueAndValidity();
      this.getDetailsById();
    }
  }

  get title() {
    return this.addPositionForm.get('title');
  }
  get description() {
    return this.addPositionForm.get('description');
  }
  get minsalary() {
    return this.addPositionForm.get('minsalary');
  }
  get mixsalary() {
    return this.addPositionForm.get('mixsalary');
  }

  getDetailsById() {
    this.positionService.getposiitonDetails(this.data.id).subscribe((res) => {
      this.addPositionForm.patchValue({
        title: res['title'],
        description: res['description'],
        minsalary: res['min_salary'],
        mixsalary: res['max_salary'],
        created_at: res['created_at'],
        updated_at: res['updated_at'],
      });
    });
  }

  saveNewPosition() {
    if (!this.addPositionForm.valid) {
      return this.validateFormFields(this.addPositionForm);
    } else {
      const formdata: any = {
        title: this.title?.value,
        description: this.description?.value,
        min_salary: this.minsalary?.value,
        max_salary: this.mixsalary?.value,
      };
      this.positionService.addnewPositions(formdata).subscribe((res) => {
        if (res) {
          this.notificationService.create(
            'success',
            'Success',
            'Position Added Successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.close();
        }
      });
    }
  }
  updatePosition() {
    if (!this.addPositionForm.valid) {
      return this.validateFormFields(this.addPositionForm);
    } else {
      const id: any = this.data.id;
      const formdata: any = {
        title: this.title?.value,
        description: this.description?.value,
        min_salary: this.minsalary?.value,
        max_salary: this.mixsalary?.value,
      };
      this.positionService.updatePosition(formdata, id).subscribe((res) => {
        if (res) {
          this.notificationService.create(
            'success',
            'Success',
            'Position updateed Successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.close();
        }
      });
    }
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'title': {
        return 'Title';
      }
      case 'description': {
        return 'Description';
      }
      case 'minsalary': {
        return 'Minimum salary';
      }
      case 'mixsalary': {
        return 'Maximum salary';
      }
    }
  }

  validateFormFields(formgroup: FormGroup) {
    Object.keys(this.addPositionForm.controls).forEach((field: any) => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          const fieldName = this.getFieldName(field);
          // this.notificationService.create(
          //   'error',
          //   'Input Error',
          //   fieldName + ' cannot be empty',
          //   { nzStyle: { background: '#200b0bff', color: '#fff' } }
          // );
        }
      } else if (control instanceof FormGroup) {
        this.validateFormFields(control);
      }
    });
  }

  close() {
    this.modal.close();
  }
}
