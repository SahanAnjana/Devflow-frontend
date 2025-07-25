import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeclinedSubAgentComponent } from './view-declined-sub-agent.component';

describe('ViewDeclinedSubAgentComponent', () => {
  let component: ViewDeclinedSubAgentComponent;
  let fixture: ComponentFixture<ViewDeclinedSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDeclinedSubAgentComponent]
    });
    fixture = TestBed.createComponent(ViewDeclinedSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
