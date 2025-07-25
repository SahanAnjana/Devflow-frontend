import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferLimitComponent } from './transfer-limit/transfer-limit.component';

const routes: Routes = [
  {
    path: '',
    component: TransferLimitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferLimitRoutingModule { }
