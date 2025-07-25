import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewContractsComponent } from './add-new-contracts.component';

describe('AddNewContractsComponent', () => {
  let component: AddNewContractsComponent;
  let fixture: ComponentFixture<AddNewContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewContractsComponent]
    });
    fixture = TestBed.createComponent(AddNewContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
