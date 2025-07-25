import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingCashCollectionComponent } from './pending-cash-collection/pending-cash-collection.component';

const routes: Routes = [
  {
    path: '',
    component: PendingCashCollectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingCashCollectionRoutingModule {}
