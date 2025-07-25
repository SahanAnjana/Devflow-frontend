import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRoleComponent } from './add-new-role.component';

describe('AddNewRoleComponent', () => {
  let component: AddNewRoleComponent;
  let fixture: ComponentFixture<AddNewRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewRoleComponent]
    });
    fixture = TestBed.createComponent(AddNewRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
