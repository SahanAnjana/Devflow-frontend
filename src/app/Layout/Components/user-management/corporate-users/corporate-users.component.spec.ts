import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateUsersComponent } from './corporate-users.component';

describe('CorporateUsersComponent', () => {
  let component: CorporateUsersComponent;
  let fixture: ComponentFixture<CorporateUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateUsersComponent]
    });
    fixture = TestBed.createComponent(CorporateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
