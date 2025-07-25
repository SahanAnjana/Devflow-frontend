import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityModeComponent } from './identity-mode.component';

describe('IdentityModeComponent', () => {
  let component: IdentityModeComponent;
  let fixture: ComponentFixture<IdentityModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdentityModeComponent]
    });
    fixture = TestBed.createComponent(IdentityModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
