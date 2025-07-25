import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationRoutingModule } from './communication-routing.module';
import { SendEmailComponent } from './send-email/send-email.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommunicationComponent } from './communication/communication.component';

@NgModule({
  declarations: [CommunicationComponent, SendEmailComponent],
  imports: [CommonModule, SharedModule, CommunicationRoutingModule],
})
export class CommunicationModule {}
