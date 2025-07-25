import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateSendEmailComponent } from './affiliate-send-email.component';

describe('AffiliateSendEmailComponent', () => {
  let component: AffiliateSendEmailComponent;
  let fixture: ComponentFixture<AffiliateSendEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateSendEmailComponent]
    });
    fixture = TestBed.createComponent(AffiliateSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
