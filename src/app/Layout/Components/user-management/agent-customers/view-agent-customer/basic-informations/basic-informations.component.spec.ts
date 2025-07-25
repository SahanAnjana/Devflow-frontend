import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInformationsComponent } from './basic-informations.component';

describe('BasicInformationsComponent', () => {
  let component: BasicInformationsComponent;
  let fixture: ComponentFixture<BasicInformationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicInformationsComponent]
    });
    fixture = TestBed.createComponent(BasicInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
