import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNewSubAgentComponent } from './view-new-sub-agent.component';

describe('ViewNewSubAgentComponent', () => {
  let component: ViewNewSubAgentComponent;
  let fixture: ComponentFixture<ViewNewSubAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewNewSubAgentComponent]
    });
    fixture = TestBed.createComponent(ViewNewSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
