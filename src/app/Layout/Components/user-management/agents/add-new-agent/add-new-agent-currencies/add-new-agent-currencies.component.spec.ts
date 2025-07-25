import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAgentCurrenciesComponent } from './add-new-agent-currencies.component';

describe('AddNewAgentCurrenciesComponent', () => {
  let component: AddNewAgentCurrenciesComponent;
  let fixture: ComponentFixture<AddNewAgentCurrenciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewAgentCurrenciesComponent]
    });
    fixture = TestBed.createComponent(AddNewAgentCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
