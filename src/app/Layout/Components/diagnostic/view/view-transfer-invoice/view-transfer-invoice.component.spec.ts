import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransferInvoiceComponent } from './view-transfer-invoice.component';

describe('ViewTransferInvoiceComponent', () => {
  let component: ViewTransferInvoiceComponent;
  let fixture: ComponentFixture<ViewTransferInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTransferInvoiceComponent]
    });
    fixture = TestBed.createComponent(ViewTransferInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
