import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ExpensesService } from 'src/app/_services/finance/expenses.service';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.sass'],
})
export class AddExpenseModalComponent implements OnInit {
  viewProjectForm!: FormGroup;
  loading = false;
  index = 'add';

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private expensesService: ExpensesService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.viewProjectForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      expense_date: [new Date(), [Validators.required]],
      employee_id: ['', [Validators.required]],
      project_id: [''],
      department_id: ['', [Validators.required]],
      currency: ['USD', [Validators.required]],
      receipt_url: [''],
    });
  }

  createNewproject(): void {
    if (this.viewProjectForm.valid) {
      this.loading = true;
      const formData = this.viewProjectForm.value;

      // Format date if needed
      if (formData.expense_date) {
        formData.expense_date = new Date(formData.expense_date).toISOString();
      }

      this.expensesService.createExpense(formData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.notification.create(
            'success',
            'Success',
            'Expense created successfully',
            { nzStyle: { background: '#00A03E', color: '#fff' } }
          );
          this.modal.destroy({ success: true });
        },
        error: (err: any) => {
          this.loading = false;
          this.notification.create(
            'error',
            'Error',
            'Failed to create expense. Please try again.',
            { nzStyle: { background: '#ff4d4f', color: '#fff' } }
          );
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.viewProjectForm.controls).forEach((key) => {
        this.viewProjectForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.modal.destroy();
  }
}
