import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompaniesService } from 'src/app/_services/crm/companies.service';

@Component({
  selector: 'app-add-new-company',
  templateUrl: './add-new-company.component.html',
  styleUrls: ['./add-new-company.component.sass'],
})
export class AddNewCompanyComponent {
  @Input() data: any;
  @Input() index: any;

  addCompamieForm!: FormGroup;
  departments: any[] = [];
  positions: any[] = [];
  managers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private notificationService: NzNotificationService,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {
    this.addCompamieForm = this.fb.group({
      name: [null, [Validators.required]],
      industry: [null, [Validators.required]],
      address: [null, [Validators.required]],
      website: [null, [Validators.required]],
      low_range: [null, [Validators.required]],
      high_range: [null, [Validators.required]],
    });

    if (this.index === 'edit') {
      this.getxixtingData();
    }
  }

  get name() {
    return this.addCompamieForm.get('name');
  }

  get industry() {
    return this.addCompamieForm.get('industry');
  }

  get address() {
    return this.addCompamieForm.get('address');
  }

  get website() {
    return this.addCompamieForm.get('website');
  }

  get low_range() {
    return this.addCompamieForm.get('low_range');
  }

  get high_range() {
    return this.addCompamieForm.get('high_range');
  }

  get custom_fields() {
    return this.addCompamieForm.get('custom_fields');
  }

  saveNewComapnie() {
    if (this.addCompamieForm.valid) {
      console.log('valid');
      const formdata = {
        name: this.name?.value,
        industry: this.industry?.value,
        address: this.address?.value,
        website: this.website?.value,
        revenue_range:
          this.low_range?.value + 'M' + '-' + this.high_range?.value + 'M',
      };
      this.companiesService.createCompanies(formdata).subscribe((res: any) => {
        if (res) {
          this.notificationService.create(
            'success',
            'Success',
            'Company Added Successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.close();
        }
      });
    } else {
      console.log('Invalid');

      Object.values(this.addCompamieForm.controls).forEach((control) => {
        if (control.invalid) {
          console.log('Invalid', control.invalid);
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getxixtingData() {
    this.companiesService
      .getCompaniesDetailsById(this.data.id)
      .subscribe((res: any) => {
        if (res['data']) {
          console.log(res);
          this.addCompamieForm.patchValue({
            name: res['data'].name,
            industry: res['data'].industry,
            address: res['data'].address,
            website: res['data'].website,
            low_range: res['data'].revenue_range?.split('-')[0].split('M')[0],
            high_range: res['data'].revenue_range.split('-')[1]?.split('M')[0],
          });
        }
      });
  }

  UpdateExistingComapnie() {
    if (this.addCompamieForm.valid) {
      console.log('valid');
      const formdata = {
        name: this.name?.value,
        industry: this.industry?.value,
        address: this.address?.value,
        website: this.website?.value,
        revenue_range:
          this.low_range?.value + 'M' + '-' + this.high_range?.value + 'M',
      };
      this.companiesService
        .updateCompanies(formdata, this.data.id)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Company Updated Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.modal.close();
          }
        });
    } else {
      console.log('Invalid');

      Object.values(this.addCompamieForm.controls).forEach((control) => {
        if (control.invalid) {
          console.log('Invalid', control.invalid);
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.modal.close();
  }
}
