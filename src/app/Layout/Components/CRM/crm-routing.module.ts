import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrmDashboardComponent } from './crm-dashboard/crm-dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CommunicatinsComponent } from './communicatins/communicatins.component';
import { PerposalsComponent } from './perposals/perposals.component';
import { DealsComponent } from './deals/deals.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    children: [
      { path: '', component: CrmDashboardComponent }, // default dashboard
      { path: 'companies', component: CompaniesComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'contracts', component: ContractsComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'communications', component: CommunicatinsComponent },
      { path: 'perposals', component: PerposalsComponent },
      { path: 'deals', component: DealsComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrmRoutingModule {}
