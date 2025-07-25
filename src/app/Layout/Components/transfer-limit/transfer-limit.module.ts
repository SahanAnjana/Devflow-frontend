import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferLimitRoutingModule } from './transfer-limit-routing.module';
import { TransferLimitComponent } from './transfer-limit/transfer-limit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddNewTransferLimitComponent } from './add-new-transfer-limit/add-new-transfer-limit.component';
import { UpdateNewTransferLimitComponent } from './update-new-transfer-limit/update-new-transfer-limit.component';

@NgModule({
  declarations: [
    TransferLimitComponent,
    UpdateNewTransferLimitComponent,
    AddNewTransferLimitComponent,
  ],
  imports: [CommonModule, TransferLimitRoutingModule, SharedModule],
})
export class TransferLimitModule {}
