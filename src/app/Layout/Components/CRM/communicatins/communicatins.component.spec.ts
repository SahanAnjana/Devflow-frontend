import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicatinsComponent } from './communicatins.component';

describe('CommunicatinsComponent', () => {
  let component: CommunicatinsComponent;
  let fixture: ComponentFixture<CommunicatinsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicatinsComponent]
    });
    fixture = TestBed.createComponent(CommunicatinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
