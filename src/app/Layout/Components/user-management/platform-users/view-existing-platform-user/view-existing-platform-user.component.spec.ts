import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExistingPlatformUserComponent } from './view-existing-platform-user.component';

describe('ViewExistingPlatformUserComponent', () => {
  let component: ViewExistingPlatformUserComponent;
  let fixture: ComponentFixture<ViewExistingPlatformUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewExistingPlatformUserComponent]
    });
    fixture = TestBed.createComponent(ViewExistingPlatformUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
