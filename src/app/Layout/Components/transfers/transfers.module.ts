import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfersRoutingModule } from './transfers-routing.module';
import { TransfersComponent } from './transfers/transfers.component';
import { TransferComponent } from './transfers/transfer/transfer.component';
import { WalletTransfersComponent } from './transfers/wallet-transfers/wallet-transfers.component';
import { PayBillTransfersComponent } from './transfers/pay-bill-transfers/pay-bill-transfers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SendMailsComponent } from './send-mails/send-mails.component';
import { AddNotesComponent } from './add-notes/add-notes.component';
import { ViewTransferComponent } from './view-transfer/view-transfer.component';
import { ViewComponent } from './view-transfer/view/view.component';
import { UserDetailsComponent } from './view-transfer/user-details/user-details.component';
import { BeneficiaryDetailsComponent } from './view-transfer/beneficiary-details/beneficiary-details.component';
import { InvoiceDetailsComponent } from './view-transfer/invoice-details/invoice-details.component';
import { TransferAmountComponent } from './transfers/transfer-amount/transfer-amount.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CloseOutline } from '@ant-design/icons-angular/icons';

@NgModule({
  declarations: [
    TransfersComponent,
    TransferComponent,
    WalletTransfersComponent,
    PayBillTransfersComponent,
    SendMailsComponent,
    AddNotesComponent,
    ViewTransferComponent,
    ViewComponent,
    UserDetailsComponent,
    BeneficiaryDetailsComponent,
    InvoiceDetailsComponent,
    TransferAmountComponent,
  ],
  imports: [
    CommonModule,
    TransfersRoutingModule,
    SharedModule,
    NzEmptyModule,
    NzIconModule.forRoot([CloseOutline]),
  ],
})
export class TransfersModule {}
