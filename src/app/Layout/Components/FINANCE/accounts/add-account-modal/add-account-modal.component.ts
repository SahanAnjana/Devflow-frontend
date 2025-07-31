import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AccountsService } from 'src/app/_services/finance/accounts.service';

@Component({
  selector: 'app-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.sass'],
})
export class AddAccountModalComponent implements OnInit {
  accountForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private accountsService: AccountsService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.accountForm = this.fb.group({
      account_number: ['', [Validators.required]],
      name: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      balance: [0, [Validators.required, Validators.min(0)]],
      account_type: ['', [Validators.required]],
    });
  }

  onCancel(): void {
    this.modal.destroy();
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.loading = true;
      const formData = this.accountForm.value;

      this.accountsService.createAccount(formData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.notification.create(
            'success',
            'Success',
            'Account created successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.destroy({ success: true });
        },
        error: (err: any) => {
          this.loading = false;
          this.notification.create(
            'error',
            'Error',
            'Failed to create account. Please try again.',
            { nzStyle: { background: '#ff4d4f', color: '#fff' } }
          );
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.accountForm.controls).forEach((key) => {
        this.accountForm.get(key)?.markAsTouched();
      });
    }
  }
}
