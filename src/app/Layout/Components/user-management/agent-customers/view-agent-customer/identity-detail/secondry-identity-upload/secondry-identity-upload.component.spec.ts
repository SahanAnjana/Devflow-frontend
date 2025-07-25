import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondryIdentityUploadComponent } from './secondry-identity-upload.component';

describe('SecondryIdentityUploadComponent', () => {
  let component: SecondryIdentityUploadComponent;
  let fixture: ComponentFixture<SecondryIdentityUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecondryIdentityUploadComponent]
    });
    fixture = TestBed.createComponent(SecondryIdentityUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
