import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BudgetsService } from 'src/app/_services/finance/budgets.service';

@Component({
  selector: 'app-add-budget-modal',
  templateUrl: './add-budget-modal.component.html',
  styleUrls: ['./add-budget-modal.component.sass'],
})
export class AddBudgetModalComponent implements OnInit {
  budgetForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private budgetsService: BudgetsService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.budgetForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0)]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      category: ['', [Validators.required]],
      status: [true],
    });
  }

  onCancel(): void {
    this.modal.destroy();
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      this.loading = true;
      const formData = this.budgetForm.value;

      // Format dates if needed
      if (formData.start_date) {
        formData.start_date = new Date(formData.start_date).toISOString();
      }
      if (formData.end_date) {
        formData.end_date = new Date(formData.end_date).toISOString();
      }

      this.budgetsService.createBudget(formData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.notification.create(
            'success',
            'Success',
            'Budget created successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.destroy({ success: true });
        },
        error: (err: any) => {
          this.loading = false;
          this.notification.create(
            'error',
            'Error',
            'Failed to create budget. Please try again.',
            { nzStyle: { background: '#ff4d4f', color: '#fff' } }
          );
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.budgetForm.controls).forEach((key) => {
        this.budgetForm.get(key)?.markAsTouched();
      });
    }
  }

  // Date validation to ensure end date is after start date
  validateEndDate = (control: any) => {
    const startDate = this.budgetForm?.get('start_date')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateInvalid: true };
    }
    return null;
  };
}
