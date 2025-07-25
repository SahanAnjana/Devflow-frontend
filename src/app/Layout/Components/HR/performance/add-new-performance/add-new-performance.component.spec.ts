import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPerformanceComponent } from './add-new-performance.component';

describe('AddNewPerformanceComponent', () => {
  let component: AddNewPerformanceComponent;
  let fixture: ComponentFixture<AddNewPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPerformanceComponent]
    });
    fixture = TestBed.createComponent(AddNewPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
