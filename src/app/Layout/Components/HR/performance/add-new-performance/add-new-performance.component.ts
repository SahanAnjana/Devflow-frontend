import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PerformanceService } from 'src/app/_services/hr-services/performance.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-add-new-performance',
  templateUrl: './add-new-performance.component.html',
  styleUrls: ['./add-new-performance.component.sass'],
})
export class AddNewPerformanceComponent {
  @Input() index: any;
  @Input() data: any;
  Employees: any = [];
  Reviwers: any = [];

  public addPerformanceForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private performanceService: PerformanceService,
    private modalService: NzModalService,
    private dataService: DataService,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.addPerformanceForm = this.formBuilder.group({
      review_period: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      employee: ['', [Validators.required]],
      reviewer: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    });

    if (this.index !== 'create') {
      this.getperformanceById();
    }
  }

  get review_period() {
    return this.addPerformanceForm.get('review_period');
  }
  get rating() {
    return this.addPerformanceForm.get('rating');
  }
  get employee() {
    return this.addPerformanceForm.get('employee');
  }
  get reviewer() {
    return this.addPerformanceForm.get('reviewer');
  }
  get comments() {
    return this.addPerformanceForm.get('comments');
  }

  getperformanceById() {
    this.performanceService
      .getPerformanceById(this.data.id)
      .subscribe((res: any) => {
        this.addPerformanceForm.patchValue({
          review_period: res.review_period,
          rating: res.rating,
          employee: res.employee,
          reviewer: res.reviewer,
          comments: res.comments,
        });
      });
  }

  saveNewPerformance() {
    if (this.addPerformanceForm.valid) {
      if (this.index === 'create') {
        this.performanceService
          .createPerformance(this.addPerformanceForm.value)
          .subscribe((res) => {
            this.modal.close(res);
          });
      } else {
        this.performanceService
          .updatePerformance(this.data.id, this.addPerformanceForm.value)
          .subscribe((res) => {
            this.modal.close(res);
          });
      }
    } else {
      Object.values(this.addPerformanceForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updatePerformance() {}

  close() {}
}
