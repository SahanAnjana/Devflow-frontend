import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedSubAgentComponent } from './declined-sub-agent.component';

describe('DeclinedSubAgentComponent', () => {
  let component: DeclinedSubAgentComponent;
  let fixture: ComponentFixture<DeclinedSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclinedSubAgentComponent]
    });
    fixture = TestBed.createComponent(DeclinedSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
