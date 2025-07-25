import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicatonsComponent } from './job-applicatons.component';

describe('JobApplicatonsComponent', () => {
  let component: JobApplicatonsComponent;
  let fixture: ComponentFixture<JobApplicatonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobApplicatonsComponent]
    });
    fixture = TestBed.createComponent(JobApplicatonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
