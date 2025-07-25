import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLimitComponent } from './transfer-limit.component';

describe('TransferLimitComponent', () => {
  let component: TransferLimitComponent;
  let fixture: ComponentFixture<TransferLimitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferLimitComponent]
    });
    fixture = TestBed.createComponent(TransferLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
