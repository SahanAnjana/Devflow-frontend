import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPlatformUsersComponent } from './add-new-platform-users.component';

describe('AddNewPlatformUsersComponent', () => {
  let component: AddNewPlatformUsersComponent;
  let fixture: ComponentFixture<AddNewPlatformUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPlatformUsersComponent]
    });
    fixture = TestBed.createComponent(AddNewPlatformUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
