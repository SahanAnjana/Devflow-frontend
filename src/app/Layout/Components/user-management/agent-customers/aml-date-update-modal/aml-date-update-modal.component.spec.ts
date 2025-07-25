import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlDateUpdateModalComponent } from './aml-date-update-modal.component';

describe('AmlDateUpdateModalComponent', () => {
  let component: AmlDateUpdateModalComponent;
  let fixture: ComponentFixture<AmlDateUpdateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmlDateUpdateModalComponent]
    });
    fixture = TestBed.createComponent(AmlDateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
