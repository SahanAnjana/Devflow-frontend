import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevFlowComponent } from './dev-flow.component';

describe('DevFlowComponent', () => {
  let component: DevFlowComponent;
  let fixture: ComponentFixture<DevFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevFlowComponent]
    });
    fixture = TestBed.createComponent(DevFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
