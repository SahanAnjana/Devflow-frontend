import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerposalsComponent } from './perposals.component';

describe('PerposalsComponent', () => {
  let component: PerposalsComponent;
  let fixture: ComponentFixture<PerposalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerposalsComponent]
    });
    fixture = TestBed.createComponent(PerposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
