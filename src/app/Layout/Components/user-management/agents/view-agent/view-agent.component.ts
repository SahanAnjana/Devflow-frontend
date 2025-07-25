import { Component } from '@angular/core';

@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.sass'],
})
export class ViewAgentComponent {
  step = 1;
  currentStepIndex = 0;
  currentStepStatus1 = 'process';
  currentStepStatus2 = 'wait';
  currentStepStatus3 = 'wait';

  next() {
    if (this.step < 4) this.step++;
    this.currentStepIndex++;

    //Step changing logic
    if (this.step === 1) {
      this.currentStepStatus2 = 'wait';
      this.currentStepStatus3 = 'wait';
    } else if (this.step === 2) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'wait';
    } else if (this.step === 3) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
    } else {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
    }
  }

  prev() {
    if (this.step > 1) this.step--;
    this.currentStepIndex--;

    // Step changing logic
    if (this.step === 1) {
      this.currentStepStatus2 = 'wait';
      this.currentStepStatus3 = 'wait';
    } else if (this.step === 2) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'wait';
    } else if (this.step === 3) {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
    } else {
      this.currentStepStatus1 = 'process';
      this.currentStepStatus2 = 'process';
      this.currentStepStatus3 = 'process';
    }
  }

  close() {}

  Update() {}
}
