import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformUserPrivillageComponent } from './platform-user-privillage.component';

describe('PlatformUserPrivillageComponent', () => {
  let component: PlatformUserPrivillageComponent;
  let fixture: ComponentFixture<PlatformUserPrivillageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformUserPrivillageComponent]
    });
    fixture = TestBed.createComponent(PlatformUserPrivillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
