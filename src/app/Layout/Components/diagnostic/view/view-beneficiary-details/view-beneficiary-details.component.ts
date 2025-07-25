import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-view-beneficiary-details',
  templateUrl: './view-beneficiary-details.component.html',
  styleUrls: ['./view-beneficiary-details.component.sass'],
})
export class ViewBeneficiaryDetailsComponent {
  @Input() formGroupName!: string;
  public beneficiaryDetailsGroupForm!: FormGroup;

  constructor(private rootFormFroup: FormGroupDirective) {}

  ngOnInit() {
    this.beneficiaryDetailsGroupForm = this.rootFormFroup.control.get(
      this.formGroupName
    ) as FormGroup;
  }
}
