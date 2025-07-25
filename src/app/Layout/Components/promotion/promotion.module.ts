import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionRoutingModule } from './promotion-routing.module';
import { PromationComponent } from './promation/promation.component';
import { AddNewPromotionComponent } from './add-new-promotion/add-new-promotion.component';
import { UpdatePromotionComponent } from './update-promotion/update-promotion.component';

@NgModule({
  declarations: [PromationComponent, AddNewPromotionComponent, UpdatePromotionComponent],
  imports: [CommonModule, PromotionRoutingModule, SharedModule],
})
export class PromotionModule {}
