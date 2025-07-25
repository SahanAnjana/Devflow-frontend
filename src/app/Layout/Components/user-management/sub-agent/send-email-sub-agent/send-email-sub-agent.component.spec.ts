import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailSubAgentComponent } from './send-email-sub-agent.component';

describe('SendEmailSubAgentComponent', () => {
  let component: SendEmailSubAgentComponent;
  let fixture: ComponentFixture<SendEmailSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailSubAgentComponent]
    });
    fixture = TestBed.createComponent(SendEmailSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
