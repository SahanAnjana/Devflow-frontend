import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MakeTransferRoutingModule } from './make-transfer-routing.module';
import { MakeTransferComponent } from './make-transfer/make-transfer.component';
import { SenderDetailsComponent } from './sender-details/sender-details.component';
import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { DecimalFormatDirective } from 'src/app/directives/decimal-format.directive';

@NgModule({
  declarations: [
    MakeTransferComponent,
    SenderDetailsComponent,
    TransferDetailsComponent,
    BeneficiaryDetailsComponent,
    ConfirmationComponent,
  ],
  imports: [CommonModule, MakeTransferRoutingModule, SharedModule],
  providers: [DecimalPipe],
})
export class MakeTransferModule {}
