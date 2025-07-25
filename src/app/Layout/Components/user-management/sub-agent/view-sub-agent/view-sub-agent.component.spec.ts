import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubAgentComponent } from './view-sub-agent.component';

describe('ViewSubAgentComponent', () => {
  let component: ViewSubAgentComponent;
  let fixture: ComponentFixture<ViewSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSubAgentComponent]
    });
    fixture = TestBed.createComponent(ViewSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
