import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBeneficiariesAccountDetailsComponent } from './view-beneficiaries-account-details.component';

describe('ViewBeneficiariesAccountDetailsComponent', () => {
  let component: ViewBeneficiariesAccountDetailsComponent;
  let fixture: ComponentFixture<ViewBeneficiariesAccountDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBeneficiariesAccountDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewBeneficiariesAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
