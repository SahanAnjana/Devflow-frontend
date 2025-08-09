import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-new-activity',
  templateUrl: './add-new-activity.component.html',
  styleUrls: ['./add-new-activity.component.sass'],
})
export class AddNewActivityComponent {
  @Input() data: any;
  @Input() index: any;
}
