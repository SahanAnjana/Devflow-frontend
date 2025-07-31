import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { InvoicesService } from 'src/app/_services/finance/invoices.service';

@Component({
  selector: 'app-add-invoice-modal',
  templateUrl: './add-invoice-modal.component.html',
  styleUrls: ['./add-invoice-modal.component.sass'],
})
export class AddInvoiceModalComponent implements OnInit {
  invoiceForm!: FormGroup;
  isSubmitting = false;
  formError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private invoicesService: InvoicesService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.invoiceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      project_id: [''],
      department_id: ['', [Validators.required]],
      created_by: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.isSubmitting = true;
      this.formError = null;

      const formData = { ...this.invoiceForm.value };

      // Format dates if they exist
      if (formData.start_date) {
        formData.start_date = new Date(formData.start_date).toISOString();
      }
      if (formData.end_date) {
        formData.end_date = new Date(formData.end_date).toISOString();
      }

      this.invoicesService.createInvoice(formData).subscribe({
        next: (response: any) => {
          this.notification.success('Success', 'Invoice created successfully');
          this.modal.close('success');
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Error creating invoice:', error);
          this.formError =
            error.error?.message ||
            'Failed to create invoice. Please try again.';
          this.notification.error(
            'Error',
            this.formError || 'Failed to create invoice. Please try again.'
          );
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.modal.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.invoiceForm.controls).forEach((key) => {
      this.invoiceForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(field: string): string {
    const control = this.invoiceForm.get(field);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(field)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(field)} must be at least ${
          control.errors['minlength'].requiredLength
        } characters`;
      }
      if (control.errors['min']) {
        return `${this.getFieldDisplayName(field)} must be greater than 0`;
      }
    }
    return '';
  }

  private getFieldDisplayName(field: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Invoice Name',
      description: 'Description',
      amount: 'Amount',
      start_date: 'Start Date',
      end_date: 'End Date',
      project_id: 'Project ID',
      department_id: 'Department ID',
      created_by: 'Created By',
    };
    return displayNames[field] || field;
  }
}
