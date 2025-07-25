import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-new-contracts',
  templateUrl: './add-new-contracts.component.html',
  styleUrls: ['./add-new-contracts.component.sass'],
})
export class AddNewContractsComponent {
  @Input() data: any;
  @Input() index: any;
}
