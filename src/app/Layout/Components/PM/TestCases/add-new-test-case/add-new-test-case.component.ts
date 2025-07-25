import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-new-test-case',
  templateUrl: './add-new-test-case.component.html',
  styleUrls: ['./add-new-test-case.component.sass'],
})
export class AddNewTestCaseComponent {
  testCaseForm!: FormGroup;
  @Input() data: any; // For edit mode
  @Input() index: any;
  isEdit = false;

  // Test case types and priorities for dropdowns
  testCaseTypes = [
    'Functional',
    'Integration',
    'End-to-End',
    'Performance',
    'Security',
    'Usability',
    'Regression',
  ];

  priorities = ['High', 'Medium', 'Low'];

  constructor(private fb: FormBuilder, private modal: NzModalRef) {}

  ngOnInit() {
    this.testCaseForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['Functional', [Validators.required]],
      priority: ['Medium', [Validators.required]],
      description: ['', [Validators.required]],
      preconditions: [''],
      steps: ['', [Validators.required]],
      expectedResults: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
      status: ['Pending'],
      step: [''],
      category: ['', [Validators.required]],
    });

    if (this.data) {
      this.isEdit = true;
      this.testCaseForm.patchValue({
        name: this.data.name,
        type: this.data.type,
        priority: this.data.priority,
        description: this.data.description,
        preconditions: this.data.preconditions,
        steps: this.data.steps,
        expectedResults: this.data.expectedResults,
        assignedTo: this.data.assignedTo,
        status: this.data.status,
      });
    }
  }

  submitForm(): void {
    if (this.testCaseForm.valid) {
      const formData = {
        ...this.testCaseForm.value,
        id: this.isEdit ? this.data.id : Date.now(), // Temporary ID generation
        lastRun: this.isEdit ? this.data.lastRun : '-',
      };
      this.modal.close(formData);
    } else {
      Object.values(this.testCaseForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  cancel(): void {
    this.modal.close();
  }

  steps = this.fb.array([this.newStepGroup()]);

  newStepGroup(): FormGroup {
    return this.fb.group({
      step: [''],
      description: [''],
    });
  }

  addStep() {
    this.steps.push(this.newStepGroup());
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }
}
