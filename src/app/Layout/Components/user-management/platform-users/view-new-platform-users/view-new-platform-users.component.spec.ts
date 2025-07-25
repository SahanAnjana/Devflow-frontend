import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNewPlatformUsersComponent } from './view-new-platform-users.component';

describe('ViewNewPlatformUsersComponent', () => {
  let component: ViewNewPlatformUsersComponent;
  let fixture: ComponentFixture<ViewNewPlatformUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewNewPlatformUsersComponent]
    });
    fixture = TestBed.createComponent(ViewNewPlatformUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
