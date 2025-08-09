import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompaniesService } from 'src/app/_services/crm/companies.service';
import { ContactsService } from 'src/app/_services/crm/contacts.service';

@Component({
  selector: 'app-add-new-contacts',
  templateUrl: './add-new-contacts.component.html',
  styleUrls: ['./add-new-contacts.component.sass'],
})
export class AddNewContactsComponent {
  @Input() data: any;
  @Input() index: any;

  addContactForm!: FormGroup;
  allCompanies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private notificationService: NzNotificationService,
    private modal: NzModalRef,
    private companyService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.addContactForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      company_id: [null, [Validators.required]],
    });

    if (this.index === 'edit') {
      this.getxixtingData();
    }

    this.getAllCompanies();
  }

  get first_name() {
    return this.addContactForm.get('first_name');
  }

  get last_name() {
    return this.addContactForm.get('last_name');
  }

  get email() {
    return this.addContactForm.get('email');
  }

  get phone() {
    return this.addContactForm.get('phone');
  }

  get company_id() {
    return this.addContactForm.get('company_id');
  }

  getAllCompanies() {
    this.companyService.getAllCompanies({}).subscribe((res: any) => {
      if (res) {
        this.allCompanies = res['data'];
      }
    });
  }

  saveNewContact() {
    if (this.addContactForm.valid) {
      console.log('valid');
      const formdata = {
        first_name: this.first_name?.value,
        last_name: this.last_name?.value,
        email: this.email?.value,
        phone: this.phone?.value,
        company_id: this.company_id?.value,
      };
      this.contactService.createContacts(formdata).subscribe((res: any) => {
        if (res) {
          this.notificationService.create(
            'success',
            'Success',
            'Contact Added Successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.close();
        }
      });
    } else {
      console.log('Invalid');

      Object.values(this.addContactForm.controls).forEach((control) => {
        if (control.invalid) {
          console.log('Invalid', control.invalid);
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getxixtingData() {
    this.contactService
      .getContactsDetailsById(this.data.id)
      .subscribe((res: any) => {
        if (res['data']) {
          console.log(res);
          this.addContactForm.patchValue({
            first_name: res['data'].first_name,
            last_name: res['data'].last_name,
            email: res['data'].email,
            phone: res['data'].phone,
            company_id: res['data'].company_id,
          });
        }
      });
  }

  UpdateExistingContact() {
    if (this.addContactForm.valid) {
      console.log('valid');
      const formdata = {
        first_name: this.first_name?.value,
        last_name: this.last_name?.value,
        email: this.email?.value,
        phone: this.phone?.value,
        company_id: this.company_id?.value,
      };
      this.contactService
        .updateContacts(formdata, this.data.id)
        .subscribe((res: any) => {
          if (res) {
            this.notificationService.create(
              'success',
              'Success',
              'Contact Updated Successfully',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.modal.close();
          }
        });
    } else {
      console.log('Invalid');

      Object.values(this.addContactForm.controls).forEach((control) => {
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
