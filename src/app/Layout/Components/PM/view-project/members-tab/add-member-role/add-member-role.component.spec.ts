import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberRoleComponent } from './add-member-role.component';

describe('AddMemberRoleComponent', () => {
  let component: AddMemberRoleComponent;
  let fixture: ComponentFixture<AddMemberRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMemberRoleComponent]
    });
    fixture = TestBed.createComponent(AddMemberRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
