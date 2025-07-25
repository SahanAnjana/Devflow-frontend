import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryIdentityUploadComponent } from './primary-identity-upload.component';

describe('PrimaryIdentityUploadComponent', () => {
  let component: PrimaryIdentityUploadComponent;
  let fixture: ComponentFixture<PrimaryIdentityUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimaryIdentityUploadComponent]
    });
    fixture = TestBed.createComponent(PrimaryIdentityUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
