import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateSettingsModalComponent } from './affiliate-settings-modal.component';

describe('AffiliateSettingsModalComponent', () => {
  let component: AffiliateSettingsModalComponent;
  let fixture: ComponentFixture<AffiliateSettingsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateSettingsModalComponent]
    });
    fixture = TestBed.createComponent(AffiliateSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
