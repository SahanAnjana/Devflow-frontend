import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UsermanagementAffliateNewAffliateService } from 'src/app/_services/usermanagement-affliate-new-affliate.service';

@Component({
  selector: 'app-view-approval-pending-affiliate',
  templateUrl: './view-approval-pending-affiliate.component.html',
  styleUrls: ['./view-approval-pending-affiliate.component.sass'],
})
export class ViewApprovalPendingAffiliateComponent {
  @Input() mode: any;
  @Input() mode2: any;
  @Input() type: any;
  public viewApprovalPendingForm!: FormGroup;
  // AllPatchDetails:any

  public unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private affliateNewAffliateService: UsermanagementAffliateNewAffliateService
  ) {}

  ngOnInit() {
    this.viewApprovalPendingForm = this.fb.group({
      subagentName: [''],
      agentName: [''],
      subagenReference: [''],
      email: [''],
      address: [''],
      date: [''],
      primaryContactNumber: [''],
      secondaryContactNumber: [''],
      baseCountry: [''],
      baseCurrency: [''],
    });

    if (this.type === 'verifyPending') {
      this.getAllVerifyPendingAgentDetails();
    } else {
      this.getAllAgentDetails();
    }
  }

  getAllAgentDetails() {
    const data: any = {};

    data['subAgentDetailsId'] = this.mode.agentDetailsId;
    data['isAffiliate'] = true;
    this.affliateNewAffliateService
      .getAlDetails(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const AllPatchDetails = res['responseDto'];
          this.viewApprovalPendingForm.patchValue({
            subagentName: AllPatchDetails.subAgentName,
            agentName: AllPatchDetails.agentName,
            subagenReference: AllPatchDetails.subAgentReference,
            email: AllPatchDetails.subAgentEmail,
            address: AllPatchDetails.subAgentAddress,
            date: AllPatchDetails.subAgentRegisteredDate,
            primaryContactNumber: AllPatchDetails.subAgentPrimaryContactNo,
            secondaryContactNumber: AllPatchDetails.subAgentSecondaryContactNo,
            baseCountry: AllPatchDetails.subAgentBaseCountry,
            baseCurrency: AllPatchDetails.subAgentBaseCurrency,
          });
        }
      });
  }

  getAllVerifyPendingAgentDetails() {
    const data: any = {};
    data['agentDetailsId'] = this.mode2.agentDetailsId;
    data['isAffiliate'] = true;

    this.affliateNewAffliateService
      .getAllVerifyPendingDetailsForPatch(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const AllPatchDetailsforVerifyPending = res['responseDto'];
          this.viewApprovalPendingForm.patchValue({
            subagentName: AllPatchDetailsforVerifyPending.subAgentName,
            agentName: AllPatchDetailsforVerifyPending.agentName,
            subagenReference: AllPatchDetailsforVerifyPending.subAgentReference,
            email: AllPatchDetailsforVerifyPending.subAgentEmail,
            address: AllPatchDetailsforVerifyPending.subAgentAddress,
            date: AllPatchDetailsforVerifyPending.subAgentRegisteredDate,
            primaryContactNumber:
              AllPatchDetailsforVerifyPending.subAgentPrimaryContactNo,
            secondaryContactNumber:
              AllPatchDetailsforVerifyPending.subAgentSecondaryContactNo,
            baseCountry: AllPatchDetailsforVerifyPending.subAgentBaseCountry,
            baseCurrency: AllPatchDetailsforVerifyPending.subAgentBaseCurrency,
          });
        }
      });
  }
}
