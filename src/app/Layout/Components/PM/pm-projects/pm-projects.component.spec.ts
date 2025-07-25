import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmProjectsComponent } from './pm-projects.component';

describe('PmProjectsComponent', () => {
  let component: PmProjectsComponent;
  let fixture: ComponentFixture<PmProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmProjectsComponent]
    });
    fixture = TestBed.createComponent(PmProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
