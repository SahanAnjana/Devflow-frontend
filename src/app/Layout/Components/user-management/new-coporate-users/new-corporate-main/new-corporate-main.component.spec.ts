import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCorporateMainComponent } from './new-corporate-main.component';

describe('NewCorporateMainComponent', () => {
  let component: NewCorporateMainComponent;
  let fixture: ComponentFixture<NewCorporateMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCorporateMainComponent]
    });
    fixture = TestBed.createComponent(NewCorporateMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
