import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-new-communication',
  templateUrl: './add-new-communication.component.html',
  styleUrls: ['./add-new-communication.component.sass'],
})
export class AddNewCommunicationComponent {
  @Input() data: any;
  @Input() index: any;
}
