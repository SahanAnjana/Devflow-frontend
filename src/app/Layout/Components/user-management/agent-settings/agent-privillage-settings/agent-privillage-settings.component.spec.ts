import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPrivillageSettingsComponent } from './agent-privillage-settings.component';

describe('AgentPrivillageSettingsComponent', () => {
  let component: AgentPrivillageSettingsComponent;
  let fixture: ComponentFixture<AgentPrivillageSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentPrivillageSettingsComponent]
    });
    fixture = TestBed.createComponent(AgentPrivillageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
