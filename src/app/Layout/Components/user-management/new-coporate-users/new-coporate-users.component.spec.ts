import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCoporateUsersComponent } from './new-coporate-users.component';

describe('NewCoporateUsersComponent', () => {
  let component: NewCoporateUsersComponent;
  let fixture: ComponentFixture<NewCoporateUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCoporateUsersComponent]
    });
    fixture = TestBed.createComponent(NewCoporateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
