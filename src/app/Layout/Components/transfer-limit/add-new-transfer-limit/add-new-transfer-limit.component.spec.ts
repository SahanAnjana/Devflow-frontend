import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTransferLimitComponent } from './add-new-transfer-limit.component';

describe('AddNewTransferLimitComponent', () => {
  let component: AddNewTransferLimitComponent;
  let fixture: ComponentFixture<AddNewTransferLimitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewTransferLimitComponent]
    });
    fixture = TestBed.createComponent(AddNewTransferLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
