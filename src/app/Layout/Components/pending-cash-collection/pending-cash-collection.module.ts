import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PendingCashCollectionRoutingModule } from './pending-cash-collection-routing.module';
import { PendingCashCollectionComponent } from './pending-cash-collection/pending-cash-collection.component';

@NgModule({
  declarations: [PendingCashCollectionComponent],
  imports: [CommonModule, PendingCashCollectionRoutingModule, SharedModule],
})
export class PendingCashCollectionModule {}
