import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromationComponent } from './promation.component';

describe('PromationComponent', () => {
  let component: PromationComponent;
  let fixture: ComponentFixture<PromationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromationComponent]
    });
    fixture = TestBed.createComponent(PromationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
