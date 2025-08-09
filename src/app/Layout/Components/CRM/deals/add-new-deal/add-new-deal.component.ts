import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-new-deal',
  templateUrl: './add-new-deal.component.html',
  styleUrls: ['./add-new-deal.component.sass'],
})
export class AddNewDealComponent {
  @Input() data: any;
  @Input() index: any;
}
