import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCustomerdocumentsComponent } from './corporate-customerdocuments.component';

describe('CorporateCustomerdocumentsComponent', () => {
  let component: CorporateCustomerdocumentsComponent;
  let fixture: ComponentFixture<CorporateCustomerdocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateCustomerdocumentsComponent]
    });
    fixture = TestBed.createComponent(CorporateCustomerdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
