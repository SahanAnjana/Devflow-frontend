import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiagnosticRoutingModule } from './diagnostic-routing.module';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { LoginDetailsComponent } from './login-details/login-details.component';
import { CustomerFollowDetailsComponent } from './customer-follow-details/customer-follow-details.component';
import { CustomerTransferFollowDetailsComponent } from './customer-transfer-follow-details/customer-transfer-follow-details.component';
import { ViewTransferComponent } from './view/view-transfer/view-transfer.component';
import { ViewComponent } from './view/view/view.component';
import { ViewUserDetailsComponent } from './view/view-user-details/view-user-details.component';
import { ViewBeneficiaryDetailsComponent } from './view/view-beneficiary-details/view-beneficiary-details.component';
import { ViewTransferInvoiceComponent } from './view/view-transfer-invoice/view-transfer-invoice.component';
import { CustomerDualRegistrationComponent } from './customer-dual-registration/customer-dual-registration.component';
import { ViewDualRegistrationDetailsComponent } from './view/view-dual-registration-details/view-dual-registration-details.component';

@NgModule({
  declarations: [
    DiagnosticComponent,
    LoginDetailsComponent,
    CustomerFollowDetailsComponent,
    CustomerTransferFollowDetailsComponent,
    ViewTransferComponent,
    ViewComponent,
    ViewUserDetailsComponent,
    ViewBeneficiaryDetailsComponent,
    ViewTransferInvoiceComponent,
    CustomerDualRegistrationComponent,
    ViewDualRegistrationDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, DiagnosticRoutingModule],
})
export class DiagnosticModule {}
