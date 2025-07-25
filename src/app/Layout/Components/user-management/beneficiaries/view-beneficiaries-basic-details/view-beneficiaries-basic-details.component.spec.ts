import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBeneficiariesBasicDetailsComponent } from './view-beneficiaries-basic-details.component';

describe('ViewBeneficiariesBasicDetailsComponent', () => {
  let component: ViewBeneficiariesBasicDetailsComponent;
  let fixture: ComponentFixture<ViewBeneficiariesBasicDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBeneficiariesBasicDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewBeneficiariesBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
