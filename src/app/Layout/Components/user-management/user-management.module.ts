import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AgentCustomersComponent } from './agent-customers/agent-customers/agent-customers.component';
import { ViewAgentCustomerTransactionModalComponent } from './agent-customers/view-agent-customer-transaction-modal/view-agent-customer-transaction-modal.component';
import { AddNotesModalComponent } from './agent-customers/add-notes-modal/add-notes-modal.component';
import { ViewAgentCustomerComponent } from './agent-customers/view-agent-customer/view-agent-customer.component';
import { BasicInformationsComponent } from './agent-customers/view-agent-customer/basic-informations/basic-informations.component';
import { PrimaryIdentityUploadComponent } from './agent-customers/view-agent-customer/identity-detail/primary-identity-upload/primary-identity-upload.component';
import { SecondryIdentityUploadComponent } from './agent-customers/view-agent-customer/identity-detail/secondry-identity-upload/secondry-identity-upload.component';
import { IdentityDetailsComponent } from './agent-customers/view-agent-customer/identity-detail/identity-details/identity-details.component';
import { PlatformUsersComponent } from './platform-users/platform-users/platform-users.component';
import { PlatformUsersModalComponent } from './platform-users/platform-users-modal/platform-users-modal.component';
import { AgentsComponent } from './agents/agents/agents.component';
import { PlatformUserPrivillageComponent } from './platform-users/platform-user-privillage/platform-user-privillage.component';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { CorporateUsersComponent } from './corporate-users/corporate-users.component';
import { NewCoporateUsersComponent } from './new-coporate-users/new-coporate-users.component';

import { BeneficiaryTransactionComponent } from './beneficiary-transaction/beneficiary-transaction.component';
import { ViewExistingPlatformUserComponent } from './platform-users/view-existing-platform-user/view-existing-platform-user.component';
import { ViewApprovalPendingComponent } from './platform-users/view-approval-pending/view-approval-pending.component';
import { AffiliateComponent } from './Affiliate/affiliate/affiliate.component';
import { AffiliateSettingsModalComponent } from './Affiliate/affiliate-settings-modal/affiliate-settings-modal.component';
import { NewAgentCustomerComponent } from './agent-customers/new-agent-customers/new-agent-customer/new-agent-customer.component';
import { ApprovalPendingAgentCustomersComponent } from './agent-customers/new-agent-customers/approval-pending-agent-customers/approval-pending-agent-customers.component';
import { DeclinedAgentCustomersComponent } from './agent-customers/new-agent-customers/declined-agent-customers/declined-agent-customers.component';
import { WithoutVerifyAgentCustomerComponent } from './agent-customers/new-agent-customers/without-verify-agent-customer/without-verify-agent-customer.component';

import { SubAgentComponent } from './sub-agent/sub-agent/sub-agent.component';
import { ViewSubAgentComponent } from './sub-agent/view-sub-agent/view-sub-agent.component';
import { ViewNewSubAgentComponent } from './sub-agent/view-new-sub-agent/view-new-sub-agent.component';
import { VerifyPendingSubAgentComponent } from './sub-agent/verify-pending-sub-agent/verify-pending-sub-agent.component';
import { ApprovalPendingSubAgentComponent } from './sub-agent/approval-pending-sub-agent/approval-pending-sub-agent.component';
import { DeclinedSubAgentComponent } from './sub-agent/declined-sub-agent/declined-sub-agent.component';
import { ViewDeclinedSubAgentComponent } from './sub-agent/view-declined-sub-agent/view-declined-sub-agent.component';
import { ViewApprovalPendingSubAgentComponent } from './sub-agent/view-approval-pending-sub-agent/view-approval-pending-sub-agent.component';
import { ViewBeneficiariesDetailsComponent } from './beneficiaries/view-beneficiaries-details/view-beneficiaries-details.component';
import { ViewBeneficiariesBasicDetailsComponent } from './beneficiaries/view-beneficiaries-basic-details/view-beneficiaries-basic-details.component';
import { ViewBeneficiariesAccountDetailsComponent } from './beneficiaries/view-beneficiaries-account-details/view-beneficiaries-account-details.component';
import { CorporateCustomerdocumentsComponent } from './corporate-customerdocuments/corporate-customerdocuments.component';
import { NewCorporateMainComponent } from './new-coporate-users/new-corporate-main/new-corporate-main.component';
import { DocumentationComponent } from './new-coporate-users/documentation/documentation.component';
import { BasicInformationComponent } from './new-coporate-users/basic-information/basic-information.component';
import { AddNewbeneficiariesComponent } from './add-newbeneficiaries/add-newbeneficiaries.component';
import { AddBeneficiariesComponent } from './add-beneficiaries/add-beneficiaries.component';
import { AddNewbeneficiariespersonalComponent } from './add-newbeneficiariespersonal/add-newbeneficiariespersonal.component';
import { AddNewbeneficiariescoporateComponent } from './add-newbeneficiariescoporate/add-newbeneficiariescoporate.component';
import { AddNewbeneficiariessaveComponent } from './add-newbeneficiariessave/add-newbeneficiariessave.component';
import { AmlDateUpdateModalComponent } from './agent-customers/aml-date-update-modal/aml-date-update-modal.component';
import { SendMailComponent } from './agent-customers/send-mail/send-mail.component';
import { NewAffiliateComponent } from './Affiliate/new-affiliate/new-affiliate/new-affiliate.component';
import { ApprovalPendingAffiliateComponent } from './Affiliate/new-affiliate/approval-pending-affiliate/approval-pending-affiliate.component';
import { DeclinedAffiliateComponent } from './Affiliate/new-affiliate/declined-affiliate/declined-affiliate.component';
import { VerifyPendingAffiliateComponent } from './Affiliate/new-affiliate/verify-pending-affiliate/verify-pending-affiliate.component';
import { ViewApprovalPendingAffiliateComponent } from './Affiliate/new-affiliate/view-approval-pending-affiliate/view-approval-pending-affiliate.component';
import { AffiliateSendEmailComponent } from './Affiliate/new-affiliate/affiliate-send-email/affiliate-send-email.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ViewNewPlatformUsersComponent } from './platform-users/view-new-platform-users/view-new-platform-users.component';
import { AddNewPlatformUsersComponent } from './platform-users/add-new-platform-users/add-new-platform-users.component';
import { ViewAgentComponent } from './agents/view-agent/view-agent.component';
import { ViewAgentBasicComponent } from './agents/view-agent/view-agent-basic/view-agent-basic.component';
import { ViewAgentCountriesComponent } from './agents/view-agent/view-agent-countries/view-agent-countries.component';
import { ViewAgentCurrenciesComponent } from './agents/view-agent/view-agent-currencies/view-agent-currencies.component';
import { AddNewAgentComponent } from './agents/add-new-agent/add-new-agent.component';
import { AddNewBasicInformationComponent } from './agents/add-new-agent/add-new-basic-information/add-new-basic-information.component';
import { AddNewDocumentationComponent } from './agents/add-new-agent/add-new-documentation/add-new-documentation.component';
import { AddNewAgentCountriesComponent } from './agents/add-new-agent/add-new-agent-countries/add-new-agent-countries.component';
import { AddNewAgentCurrenciesComponent } from './agents/add-new-agent/add-new-agent-currencies/add-new-agent-currencies.component';
import { SendEmailComponent } from './platform-users/send-email/send-email.component';
import { SendEmailSubAgentComponent } from './sub-agent/send-email-sub-agent/send-email-sub-agent.component';
import { ViewVerifyPendingSubAgentComponent } from './sub-agent/view-verify-pending-sub-agent/view-verify-pending-sub-agent.component';
import { AgentPrivillageSettingsComponent } from './agent-settings/agent-privillage-settings/agent-privillage-settings.component';
import { TransactionConfigComponent } from './agent-settings/transaction-config/transaction-config.component';
import { RateSettingsComponent } from './agent-settings/rate-settings/rate-settings.component';
import { CreditBalanceComponent } from './agent-settings/credit-balance/credit-balance.component';
import { AgentSettingModalComponent } from './agent-settings/agent-setting-modal/agent-setting-modal.component';
import { AgentApprovedCurrenciesComponent } from './agent-settings/agent-approved-currencies/agent-approved-currencies.component';
import { AccountDetailsComponent } from './agent-settings/account-details/account-details.component';
import { TransferModeComponent } from './agent-settings/transaction-config/transfer-mode/transfer-mode.component';
import { PaymentModeComponent } from './agent-settings/transaction-config/payment-mode/payment-mode.component';
import { IdentityModeComponent } from './agent-settings/transaction-config/identity-mode/identity-mode.component';
import { TransferFeeComponent } from './agent-settings/transfer-fee/transfer-fee.component';
import { CurrencyAmountValidationComponent } from './agent-settings/currency-amount-validation/currency-amount-validation.component';
import { AgentApprovedCountriesComponent } from './agent-settings/agent-approved-countries/agent-approved-countries.component';
import { NotificationComponent } from './agent-settings/notification/notification.component';
import { CoporateUsersViewComponent } from './coporate-users-view/coporate-users-view.component';
import { coporateCustomerBasicInformation } from './coporate-users-view/coporate-customer-basicinformation/coporate-customer-basicinformation.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    AgentCustomersComponent,
    ViewAgentCustomerTransactionModalComponent,
    AddNotesModalComponent,
    ViewAgentCustomerComponent,
    BasicInformationsComponent,
    PrimaryIdentityUploadComponent,
    SecondryIdentityUploadComponent,
    IdentityDetailsComponent,
    PlatformUsersComponent,
    PlatformUsersModalComponent,
    AgentsComponent,
    PlatformUserPrivillageComponent,
    AgentPrivillageSettingsComponent,
    TransactionConfigComponent,
    RateSettingsComponent,
    CreditBalanceComponent,
    EditUserComponent,
    BeneficiariesComponent,
    CorporateUsersComponent,
    NewCoporateUsersComponent,
    DeclinedAgentCustomersComponent,
    BeneficiaryTransactionComponent,
    AgentSettingModalComponent,
    ViewExistingPlatformUserComponent,
    AgentApprovedCurrenciesComponent,
    ViewApprovalPendingComponent,
    AccountDetailsComponent,
    AffiliateComponent,
    AffiliateSettingsModalComponent,
    NewCorporateMainComponent,
    BasicInformationComponent,
    DocumentationComponent,
    CorporateCustomerdocumentsComponent,
    NewAgentCustomerComponent,
    ApprovalPendingAgentCustomersComponent,
    WithoutVerifyAgentCustomerComponent,
    TransferModeComponent,
    DeclinedAgentCustomersComponent,
    PaymentModeComponent,
    IdentityModeComponent,
    TransferFeeComponent,
    NotificationComponent,
    CurrencyAmountValidationComponent,
    AgentApprovedCountriesComponent,
    SubAgentComponent,
    ViewSubAgentComponent,
    ViewNewSubAgentComponent,
    VerifyPendingSubAgentComponent,
    DeclinedAgentCustomersComponent,
    ApprovalPendingSubAgentComponent,
    DeclinedSubAgentComponent,
    ViewDeclinedSubAgentComponent,
    ViewApprovalPendingComponent,
    ViewApprovalPendingSubAgentComponent,
    AmlDateUpdateModalComponent,
    SendMailComponent,
    PaymentModeComponent,
    IdentityModeComponent,
    TransferFeeComponent,
    NotificationComponent,
    CurrencyAmountValidationComponent,
    AgentApprovedCountriesComponent,
    ViewBeneficiariesDetailsComponent,
    ViewBeneficiariesBasicDetailsComponent,
    ViewBeneficiariesAccountDetailsComponent,
    CorporateCustomerdocumentsComponent,
    NewCoporateUsersComponent,
    NewCorporateMainComponent,
    DocumentationComponent,
    BasicInformationComponent,
    CorporateUsersComponent,
    BeneficiariesComponent,
    AddNewbeneficiariesComponent,
    AddBeneficiariesComponent,
    AddNewbeneficiariespersonalComponent,
    AddNewbeneficiariescoporateComponent,
    AddNewbeneficiariessaveComponent,
    NewAffiliateComponent,
    ApprovalPendingAffiliateComponent,
    DeclinedAffiliateComponent,
    VerifyPendingAffiliateComponent,
    ViewApprovalPendingAffiliateComponent,
    AffiliateSendEmailComponent,
    ViewNewPlatformUsersComponent,
    AddNewPlatformUsersComponent,
    ViewAgentComponent,
    ViewAgentBasicComponent,
    ViewAgentCountriesComponent,
    ViewAgentCurrenciesComponent,
    AddNewAgentComponent,
    AddNewBasicInformationComponent,
    AddNewDocumentationComponent,
    AddNewAgentCountriesComponent,
    AddNewAgentCurrenciesComponent,
    SendEmailComponent,
    SendEmailSubAgentComponent,
    ViewVerifyPendingSubAgentComponent,
    CoporateUsersViewComponent,
    coporateCustomerBasicInformation,
  ],
  imports: [
    SharedModule,
    UserManagementRoutingModule,
    CommonModule,
    AngularEditorModule,
    AngularEditorModule,
    CommonModule,
  ],
})
export class UserManagementModule {}
