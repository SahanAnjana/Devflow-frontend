import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedAffiliateComponent } from './declined-affiliate.component';

describe('DeclinedAffiliateComponent', () => {
  let component: DeclinedAffiliateComponent;
  let fixture: ComponentFixture<DeclinedAffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclinedAffiliateComponent]
    });
    fixture = TestBed.createComponent(DeclinedAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
