import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentCountriesComponent } from './view-agent-countries.component';

describe('ViewAgentCountriesComponent', () => {
  let component: ViewAgentCountriesComponent;
  let fixture: ComponentFixture<ViewAgentCountriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAgentCountriesComponent]
    });
    fixture = TestBed.createComponent(ViewAgentCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
