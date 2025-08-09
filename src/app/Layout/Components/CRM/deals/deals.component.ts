import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DealsService } from 'src/app/_services/crm/deals.service';
import { AddNewDealComponent } from './add-new-deal/add-new-deal.component';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.sass'],
})
export class DealsComponent {
  allDeals: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private DealsService: DealsService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllDeals();
  }

  getAllDeals() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['company_id'] = '';
    data['tags'] = '';
    data['search'] = '';

    this.DealsService.getAllDeals(data).subscribe((res: any) => {
      if (res) {
        this.allDeals = res['data'];
      }
    });
  }

  addNewDeals(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Deals',
      nzContent: AddNewDealComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-Deals',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllDeals();
    });
  }

  viewDeals(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Deals',
      nzContent: AddNewDealComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-Deals',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllDeals();
    });
  }

  editDeals(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Deals',
      nzContent: AddNewDealComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-Deals',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllDeals();
    });
  }

  deleteDeals(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this Deals?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.DealsService.deleteDeals(id).subscribe((res: any) => {
          if (res) {
            this.getAllDeals();
          }
        });
      },
      nzCancelText: 'No, cancel',
      nzIconType: 'warning',
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllDeals();
  }
}
