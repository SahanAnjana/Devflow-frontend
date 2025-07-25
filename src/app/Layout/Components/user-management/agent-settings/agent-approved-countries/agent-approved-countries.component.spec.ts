import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentApprovedCountriesComponent } from './agent-approved-countries.component';

describe('AgentApprovedCountriesComponent', () => {
  let component: AgentApprovedCountriesComponent;
  let fixture: ComponentFixture<AgentApprovedCountriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentApprovedCountriesComponent]
    });
    fixture = TestBed.createComponent(AgentApprovedCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
