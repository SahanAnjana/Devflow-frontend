import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDualRegistrationDetailsComponent } from './view-dual-registration-details.component';

describe('ViewDualRegistrationDetailsComponent', () => {
  let component: ViewDualRegistrationDetailsComponent;
  let fixture: ComponentFixture<ViewDualRegistrationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDualRegistrationDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewDualRegistrationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
