import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosticRoutingModule {}
