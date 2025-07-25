import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TFACodeComponent } from './tfa-code.component';

describe('TFACodeComponent', () => {
  let component: TFACodeComponent;
  let fixture: ComponentFixture<TFACodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TFACodeComponent]
    });
    fixture = TestBed.createComponent(TFACodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
