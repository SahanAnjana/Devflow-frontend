import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromationComponent } from './promation/promation.component';

const routes: Routes = [
  {
    path: '',
    component: PromationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionRoutingModule {}
