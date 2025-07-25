import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.sass'],
})
export class ViewUserDetailsComponent {
  @Input() formGroupName!: string;
  public userDetailsGroupForm!: FormGroup;

  constructor(private rootFormFroup: FormGroupDirective) {}

  ngOnInit() {
    this.userDetailsGroupForm = this.rootFormFroup.control.get(
      this.formGroupName
    ) as FormGroup;
  }
}
