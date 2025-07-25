import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentBasicComponent } from './view-agent-basic.component';

describe('ViewAgentBasicComponent', () => {
  let component: ViewAgentBasicComponent;
  let fixture: ComponentFixture<ViewAgentBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAgentBasicComponent]
    });
    fixture = TestBed.createComponent(ViewAgentBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
