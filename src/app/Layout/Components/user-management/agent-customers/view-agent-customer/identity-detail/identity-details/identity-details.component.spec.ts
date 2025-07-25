import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityDetailsComponent } from './identity-details.component';

describe('IdentityDetailsComponent', () => {
  let component: IdentityDetailsComponent;
  let fixture: ComponentFixture<IdentityDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdentityDetailsComponent]
    });
    fixture = TestBed.createComponent(IdentityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
