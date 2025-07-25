import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSettingModalComponent } from './agent-setting-modal.component';

describe('AgentSettingModalComponent', () => {
  let component: AgentSettingModalComponent;
  let fixture: ComponentFixture<AgentSettingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentSettingModalComponent]
    });
    fixture = TestBed.createComponent(AgentSettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
