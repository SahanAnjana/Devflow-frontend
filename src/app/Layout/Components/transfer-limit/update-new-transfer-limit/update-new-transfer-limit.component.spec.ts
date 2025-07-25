import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNewTransferLimitComponent } from './update-new-transfer-limit.component';

describe('UpdateNewTransferLimitComponent', () => {
  let component: UpdateNewTransferLimitComponent;
  let fixture: ComponentFixture<UpdateNewTransferLimitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateNewTransferLimitComponent]
    });
    fixture = TestBed.createComponent(UpdateNewTransferLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
