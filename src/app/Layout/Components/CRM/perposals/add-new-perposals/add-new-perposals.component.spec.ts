import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPerposalsComponent } from './add-new-perposals.component';

describe('AddNewPerposalsComponent', () => {
  let component: AddNewPerposalsComponent;
  let fixture: ComponentFixture<AddNewPerposalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPerposalsComponent]
    });
    fixture = TestBed.createComponent(AddNewPerposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
