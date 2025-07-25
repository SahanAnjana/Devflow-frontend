import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoporateUsersViewComponent } from './coporate-users-view.component';

describe('CoporateUsersViewComponent', () => {
  let component: CoporateUsersViewComponent;
  let fixture: ComponentFixture<CoporateUsersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoporateUsersViewComponent]
    });
    fixture = TestBed.createComponent(CoporateUsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
