import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentApprovedCurrenciesComponent } from './agent-approved-currencies.component';

describe('AgentApprovedCurrenciesComponent', () => {
  let component: AgentApprovedCurrenciesComponent;
  let fixture: ComponentFixture<AgentApprovedCurrenciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentApprovedCurrenciesComponent]
    });
    fixture = TestBed.createComponent(AgentApprovedCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
