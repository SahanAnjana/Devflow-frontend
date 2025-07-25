import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateSettingsComponent } from './rate-settings.component';

describe('RateSettingsComponent', () => {
  let component: RateSettingsComponent;
  let fixture: ComponentFixture<RateSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateSettingsComponent]
    });
    fixture = TestBed.createComponent(RateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
