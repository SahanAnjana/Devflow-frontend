import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePromotionComponent } from './update-promotion.component';

describe('UpdatePromotionComponent', () => {
  let component: UpdatePromotionComponent;
  let fixture: ComponentFixture<UpdatePromotionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePromotionComponent]
    });
    fixture = TestBed.createComponent(UpdatePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
