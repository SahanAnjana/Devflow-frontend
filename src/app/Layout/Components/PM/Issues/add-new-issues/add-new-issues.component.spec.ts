import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewIssuesComponent } from './add-new-issues.component';

describe('AddNewIssuesComponent', () => {
  let component: AddNewIssuesComponent;
  let fixture: ComponentFixture<AddNewIssuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewIssuesComponent]
    });
    fixture = TestBed.createComponent(AddNewIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
