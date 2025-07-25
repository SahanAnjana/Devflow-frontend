import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrmRoutingModule } from './crm-routing.module';
import { CrmDashboardComponent } from './crm-dashboard/crm-dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ContractsComponent } from './contracts/contracts.component';
import { PerposalsComponent } from './perposals/perposals.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CommunicatinsComponent } from './communicatins/communicatins.component';
import { DealsComponent } from './deals/deals.component';
import { AddNewActivityComponent } from './activities/add-new-activity/add-new-activity.component';
import { AddNewCommunicationComponent } from './communicatins/add-new-communication/add-new-communication.component';
import { AddNewCompanyComponent } from './companies/add-new-company/add-new-company.component';
import { AddNewContactsComponent } from './contacts/add-new-contacts/add-new-contacts.component';
import { AddNewContractsComponent } from './contracts/add-new-contracts/add-new-contracts.component';
import { AddNewDealComponent } from './deals/add-new-deal/add-new-deal.component';
import { AddNewPerposalsComponent } from './perposals/add-new-perposals/add-new-perposals.component';

@NgModule({
  declarations: [
    CrmDashboardComponent,
    CompaniesComponent,
    ActivitiesComponent,
    ContractsComponent,
    PerposalsComponent,
    ContactsComponent,
    CommunicatinsComponent,
    DealsComponent,
    AddNewActivityComponent,
    AddNewCommunicationComponent,
    AddNewCompanyComponent,
    AddNewContactsComponent,
    AddNewContractsComponent,
    AddNewDealComponent,
    AddNewPerposalsComponent
  ],
  imports: [CommonModule, CrmRoutingModule, SharedModule],
})
export class CrmModule {}
