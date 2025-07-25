import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformUsersModalComponent } from './platform-users-modal.component';

describe('PlatformUsersModalComponent', () => {
  let component: PlatformUsersModalComponent;
  let fixture: ComponentFixture<PlatformUsersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformUsersModalComponent]
    });
    fixture = TestBed.createComponent(PlatformUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
