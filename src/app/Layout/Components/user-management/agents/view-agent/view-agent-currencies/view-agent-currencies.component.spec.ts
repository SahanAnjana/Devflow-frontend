import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentCurrenciesComponent } from './view-agent-currencies.component';

describe('ViewAgentCurrenciesComponent', () => {
  let component: ViewAgentCurrenciesComponent;
  let fixture: ComponentFixture<ViewAgentCurrenciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAgentCurrenciesComponent]
    });
    fixture = TestBed.createComponent(ViewAgentCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
