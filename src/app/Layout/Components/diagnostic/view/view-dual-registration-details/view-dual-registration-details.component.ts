import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DiagnosticService } from 'src/app/_services/diagnostic.service';
import { Subject, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-view-dual-registration-details',
  templateUrl: './view-dual-registration-details.component.html',
  styleUrls: ['./view-dual-registration-details.component.sass'],
})
export class ViewDualRegistrationDetailsComponent {
  @Input() mode: any;

  public unsubscribe$ = new Subject<void>();

  dualPopUpdata: any;
  email: any;
  customerPlaceOfBirth: any;
  customerDateOfBirth: any;

  agentName = 'Agent';

  isActive = false;
  panels = [
    {
      name: 'qa_Spoton Money',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private diagnosticService: DiagnosticService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getPopUpData();
  }
  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notification.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }
  getPopUpData() {
    const data: any = {};
    data['dateOfBirth'] = this.mode.dateOfBirth;
    data['placeOfBirth'] = this.mode.placeOfBirth;
    data['telephoneNo'] = this.mode.phoneNumber;
    data['customerName'] = this.mode.senderName;
    this.diagnosticService
      .getdualRegistrationPopData(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto'] != null) {
          this.dualPopUpdata = res['responseDto'];
          // this.email = res['responseDto'].customerEmail;
          // this.customerPlaceOfBirth =
          //   res['responseDto']['customerPlaceOfBirth'];
          // this.customerDateOfBirth = res['responseDto']['customerDateOfBirth'];
          // console.log('email', this.dualPopUpdata);
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notification.create('error', 'Error', msg, {
            nzStyle: { background: '#FF0000', color: '#FFFFFF' },
          });
        }
      });
  }

  downloadImage() {
    const data: any = {};
    data['email'] = this.email;
    data['dateOfBirth'] = this.customerDateOfBirth;
    data['birthPlace'] = this.customerPlaceOfBirth;

    this.diagnosticService
      .downloadImage(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.createNotification(
          'success',
          'Success',
          'File Downoaded successfully',
          '#ffffff',
          '#00A03E'
        );
      });
  }

  downloadAmlReport(value: any) {
    const data: any = {};
    data['journeyId'] = value.journeyId;
    this.diagnosticService
      .downloadAmlReport(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {});
  }

  view() {
    this.isActive = !this.isActive;
  }

  download(values: any) {
    this.email = values.customerEmail;
    this.customerDateOfBirth = values.customerDateOfBirth;
    this.customerPlaceOfBirth = values.customerPlaceOfBirth;
    this.downloadImage();
  }
  report() {}
}
