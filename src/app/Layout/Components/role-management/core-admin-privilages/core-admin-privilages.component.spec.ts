import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreAdminPrivilagesComponent } from './core-admin-privilages.component';

describe('CoreAdminPrivilagesComponent', () => {
  let component: CoreAdminPrivilagesComponent;
  let fixture: ComponentFixture<CoreAdminPrivilagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoreAdminPrivilagesComponent]
    });
    fixture = TestBed.createComponent(CoreAdminPrivilagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
