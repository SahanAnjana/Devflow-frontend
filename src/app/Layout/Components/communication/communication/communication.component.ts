import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SendEmailComponent } from '../send-email/send-email.component';
import { CommunicationService } from 'src/app/_services/communication.service';
import format from 'date-fns/format';
import { differenceInCalendarDays } from 'date-fns';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.sass'],
})
export class CommunicationComponent {
  receiverEmail: any;
  senderEmail: any;
  communicationData: any;
  currentPageIndex = 1;
  pageNumber: any = 1;
  totalRecords: any;
  pageSize: any = 10;
  fromDate: any;
  toDate: any;
  subject: any;
  statusSent: any;
  sentBy: any;
  receivedBy: any;
  statusNotSent: any;
  status: any = '';

  constructor(
    private modalservice: NzModalService,
    private communicationService: CommunicationService,
    private eventTriggerService: EventTriggerService
  ) {}

  ngOnInit() {
    this.getAllCom();
    this.eventTriggerService.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res === 'comMail') {
          this.getAllCom();
        }
      },
    });
  }
  byStatus() {
    if (this.statusSent == true) {
      this.status = true;
    }
    if (this.statusNotSent == true) {
      this.status = false;
    }
    // console.log(this.status);
    this.getAllCom();
  }
  getAllCom() {
    const data: any = {};
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;
    data['sentBy'] = this.sentBy;
    data['recieverEmail'] = this.receivedBy;
    data['subject'] = this.subject;
    data['isSuccess'] = this.status;
    data['fromDate'] = this.fromDate ? format(this.fromDate, 'yyyy-MM-dd') : '';
    data['toDate'] = this.toDate ? format(this.toDate, 'yyyy-MM-dd') : '';
    this.communicationService.getAllCommunication(data).subscribe((res) => {
      if (res['responseDto']) {
        this.communicationData = res['responseDto']['payload'];
        this.totalRecords = res['responseDto']['totalRecords'];
      }
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllCom();
  }
  sendEmail() {
    this.modalservice.create({
      nzTitle: 'Send New Email',
      nzContent: SendEmailComponent,
      nzClassName: 'send_email',
      nzFooter: null,
      nzWidth: 720,
    });
  }
  resetReceiverEmail() {
    this.receiverEmail = '';
    this.getAllCom();
  }
  resetSenderEmail() {
    this.senderEmail = '';
    this.getAllCom();
  }
  resetDateFilter() {
    this.fromDate = '';
    this.toDate = '';
    this.getAllCom();
  }

  resetSubject() {
    this.subject = '';
    this.getAllCom();
  }
  resetStatus() {
    this.status = '';
    this.statusSent = '';
    this.statusNotSent = '';
    this.getAllCom();
  }

  resetSentBy() {
    this.sentBy = '';
    this.getAllCom();
  }

  receivedByfilter() {
    this.receivedBy = '';
    this.getAllCom();
  }
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;
}
