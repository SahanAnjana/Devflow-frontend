import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from 'src/app/_services/agent.service';
import { MetaService } from 'src/app/_services/meta.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { SubAgentSettingsService } from 'src/app/_services/sub-agent-settings.service';

@Component({
  selector: 'app-agent-approved-countries',
  templateUrl: './agent-approved-countries.component.html',
  styleUrls: ['./agent-approved-countries.component.sass'],
})
export class AgentApprovedCountriesComponent {
  tableData: any[] = [];
  pageSize: any = 5;
  pageNumber: any = 1;
  currentIndex: any = 1;
  totalRecords: any;
  currentPageIndex = 1;
  exposableId: any;
  selectedCountry: any;
  clientCountryDtoList: any[] = [];
  currency_data: any;
  sendingCurrency_data: any[] = [];
  selectedCurrency: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  transferFeeform!: FormGroup;

  countryList: any = [];
  receivingCountriesList: any;
  constructor(
    private modalRef: NzModalRef,
    private modalService: NzModalService,
    private router: Router,
    private subAgentSetting: SubAgentSettingsService,
    private metaService: MetaService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private agentService: AgentService,
    private notification: NzNotificationService,
    private eventTrigger: EventTriggerService
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.getAgentSendingReceivingCurrency();
    this.getAllApprovedSendingRecievingCountries();
    this.eventTrigger.executeOnchangeFunction.subscribe({
      next: (res: any) => {
        if (res == 'currencyValidation') {
          this.getAgentSendingReceivingCurrency();
        }
      },
    });
  }

  getAgentSendingReceivingCurrency() {
    this.agentService
      .getAgentSendingReceivingCurrency(
        this.dataService.selectedData.exposableId,
        'GBP'
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.sendingCurrency_data = res['responseDto'];
          console.log('subSendCurrency', this.sendingCurrency_data);
        },
      });
  }

  getAllApprovedSendingRecievingCountries() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.exposableId;
    data['pageNumber'] = this.pageNumber;
    data['pageSize'] = this.pageSize;

    this.agentService
      .getAllagentReceivingCountries(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.tableData = res['responseDto']['payload'];
            this.totalRecords = res['responseDto']['totalRecords'];
          } else {
            this.tableData = [];
            this.totalRecords = 0;
          }
        },
        error: (e: any) => {
          this.tableData = [];
        },
      });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllApprovedSendingRecievingCountries();
  }
  getSelectedCountry(event: any) {
    this.clientCountryDtoList = event.map(
      (country: { countryId: any; clientCountryId: any }) => ({
        countryId: country.countryId,
        clientCountryId: country.clientCountryId,
      })
    );
    console.log(this.clientCountryDtoList);
  }
  getCountries() {
    this.agentService
      .getAgentCountries(this.dataService.selectedData.exposableId)
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            this.countryList = res['responseDto'];
          }
        },
      });
  }

  update() {
    console.log(this.selectedCurrency);

    const body = [
      {
        agentTransferApprovedSendingReceivingCurrenciesDto: {
          agentTransferApprovedSendingReceivingCurrenciesId:
            this.selectedCurrency,
        },
        clientCountryDtoList: this.clientCountryDtoList,
      },
    ];
    this.agentService.saveAgentReceivingCountry(body).subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.createNotifications(
            'success',
            'Country Updated Successfully',
            '#F45300',
            'Success'
          );

          this.close();
          this.getAllApprovedSendingRecievingCountries();
        } else {
          this.createNotifications(
            'Error',
            res['errorDescription'],
            '#F45300',
            'Error'
          );
        }
      },
    });
  }
  createNotifications(
    type: string,
    content: string,
    color: string,
    title: string
  ): void {
    // console.log('createNotification');
    // title: string, message: string
    this.notification.create(type, title, content, {
      nzStyle: {
        background: color,
        color: '#fff',
        // width: '600px',
        // marginLeft: '-265px'
      },
    });
  }
  close() {
    // this.modalRef.destroy();
    this.clientCountryDtoList = [];
    this.getCountries();
  }
}
