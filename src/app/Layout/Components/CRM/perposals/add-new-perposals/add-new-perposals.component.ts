import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-new-perposals',
  templateUrl: './add-new-perposals.component.html',
  styleUrls: ['./add-new-perposals.component.sass'],
})
export class AddNewPerposalsComponent {
  @Input() data: any;
  @Input() index: any;
}
