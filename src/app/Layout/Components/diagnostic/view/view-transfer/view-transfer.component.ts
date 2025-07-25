import { Component, Input, Optional } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-view-transfer',
  templateUrl: './view-transfer.component.html',
  styleUrls: ['./view-transfer.component.sass'],
})
export class ViewTransferComponent {
  @Input() formGroupName!: string;

  public viewTransferGroupForm!: FormGroup;

  constructor(private rootFormFroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.viewTransferGroupForm = this.rootFormFroup.control.get(
      this.formGroupName
    ) as FormGroup;
  }
}
