import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBeneficiariesDetailsComponent } from './view-beneficiaries-details.component';

describe('ViewBeneficiariesDetailsComponent', () => {
  let component: ViewBeneficiariesDetailsComponent;
  let fixture: ComponentFixture<ViewBeneficiariesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBeneficiariesDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewBeneficiariesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
