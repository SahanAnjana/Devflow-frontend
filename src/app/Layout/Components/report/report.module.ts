import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransferSummaryReportComponent } from './transfer-summary-report/transfer-summary-report.component';
import { TransferAmenmentReportComponent } from './transfer-amenment-report/transfer-amenment-report.component';
import { CashCollectionReportComponent } from './cash-collection-report/cash-collection-report.component';
import { SubAgentCommissionReportComponent } from './sub-agent-commission-report/sub-agent-commission-report.component';
import { AddNotesComponent } from './transfer-summary-report/add-notes/add-notes.component';
import { ReportviewComponent } from './reportview/reportview.component';
import { ReportViewTransferComponent } from './report-view-transfer/report-view-transfer.component';
import { ReportViewUserdetailsComponent } from './report-view-userdetails/report-view-userdetails.component';
import { ReportViewBeneficiarydetailsComponent } from './report-view-beneficiarydetails/report-view-beneficiarydetails.component';
import { ReportViewTransferinvoiceComponent } from './report-view-transferinvoice/report-view-transferinvoice.component';

@NgModule({
  declarations: [
    ReportComponent,
    TransferSummaryReportComponent,
    TransferAmenmentReportComponent,
    CashCollectionReportComponent,
    SubAgentCommissionReportComponent,
    AddNotesComponent,
    ReportviewComponent,
    ReportViewTransferComponent,
    ReportViewUserdetailsComponent,
    ReportViewBeneficiarydetailsComponent,
    ReportViewTransferinvoiceComponent,
  ],
  imports: [CommonModule, ReportRoutingModule, SharedModule],
})
export class ReportModule {}
