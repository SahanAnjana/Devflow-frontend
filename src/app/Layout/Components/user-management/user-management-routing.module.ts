import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { ViewNewSubAgentComponent } from '../user-management/sub-agent/view-new-sub-agent/view-new-sub-agent.component';
import { SubAgentComponent } from '../user-management/sub-agent/sub-agent/sub-agent.component';
import { NewAgentCustomerComponent } from './agent-customers/new-agent-customers/new-agent-customer/new-agent-customer.component';
import { NewAffiliateComponent } from './Affiliate/new-affiliate/new-affiliate/new-affiliate.component';
import { NewCoporateUsersComponent } from './new-coporate-users/new-coporate-users.component';
import { CorporateUsersComponent } from './corporate-users/corporate-users.component';
import { ViewNewPlatformUsersComponent } from './platform-users/view-new-platform-users/view-new-platform-users.component';
import { PlatformUsersComponent } from './platform-users/platform-users/platform-users.component';
import { AgentsComponent } from './agents/agents/agents.component';
import { AgentCustomersComponent } from './agent-customers/agent-customers/agent-customers.component';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { AffiliateComponent } from './Affiliate/affiliate/affiliate.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
  },
  {
    path: 'view-new-sub-agent',
    component: ViewNewSubAgentComponent,
  },
  {
    path: 'sub-agent',
    component: SubAgentComponent,
  },
  {
    path: 'view-new-affliate',
    component: NewAffiliateComponent,
  },
  {
    path: 'new-agent-customers',
    component: NewAgentCustomerComponent,
  },
  {
    path: 'coporate-user',
    component: NewCoporateUsersComponent,
  },
  {
    path: 'view-new-platform-user',
    component: ViewNewPlatformUsersComponent,
  },
  {
    path: '',
    component: UserManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
