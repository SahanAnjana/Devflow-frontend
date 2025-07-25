import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedAgentCustomersComponent } from './declined-agent-customers.component';

describe('DeclinedAgentCustomersComponent', () => {
  let component: DeclinedAgentCustomersComponent;
  let fixture: ComponentFixture<DeclinedAgentCustomersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclinedAgentCustomersComponent]
    });
    fixture = TestBed.createComponent(DeclinedAgentCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
