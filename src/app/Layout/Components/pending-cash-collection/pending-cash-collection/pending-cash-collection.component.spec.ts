import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCashCollectionComponent } from './pending-cash-collection.component';

describe('PendingCashCollectionComponent', () => {
  let component: PendingCashCollectionComponent;
  let fixture: ComponentFixture<PendingCashCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingCashCollectionComponent]
    });
    fixture = TestBed.createComponent(PendingCashCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
