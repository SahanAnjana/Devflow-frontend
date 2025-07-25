import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { EventTriggerService } from 'src/app/_services/shared-data/eventtrigger.service';
import { TransferTabService } from 'src/app/_services/transfer-tab.service';

@Component({
  selector: 'app-pay-bill-transfers',
  templateUrl: './pay-bill-transfers.component.html',
  styleUrls: ['./pay-bill-transfers.component.sass']
})
export class PayBillTransfersComponent {
 
currentPageIndex: any;
  constructor(
    
    private transferService: TransferTabService,
    private eventTrigger: EventTriggerService,
    private notification: NzNotificationService,
    private dataService: DataService,
   
  ) {}
  ngOnInit() {
    this.getTransferDetails();  
  }
  pageSize: any=10;
  pageNumber: any=1;
  TransferDetails: any;
  totalRecords: any;

  getTransferDetails() {
    const data: any = {};
    
    data['pageSize'] = this.pageSize;
    data['pageNumber'] = this.pageNumber;
    return this.transferService.paybillGetAll(data).subscribe((res) => {
      if (res['responseDto']) {
        this.TransferDetails = res['responseDto'];
        this.totalRecords = res['responseDto']['totalRecords'];
        
      } else {
        this.TransferDetails = [];
      }
    });
  }
  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getTransferDetails();
  }
}
