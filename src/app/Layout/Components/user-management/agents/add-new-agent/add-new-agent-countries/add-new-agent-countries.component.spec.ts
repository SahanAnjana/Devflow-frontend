import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAgentCountriesComponent } from './add-new-agent-countries.component';

describe('AddNewAgentCountriesComponent', () => {
  let component: AddNewAgentCountriesComponent;
  let fixture: ComponentFixture<AddNewAgentCountriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewAgentCountriesComponent]
    });
    fixture = TestBed.createComponent(AddNewAgentCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
