import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventTriggerService {
  executeOnchangeFunction = new EventEmitter();

  constructor() {}

  onReloadServiceData(data: any = null) {
    this.executeOnchangeFunction.emit(data);
  }
}
