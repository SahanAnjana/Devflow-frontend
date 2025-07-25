import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PerposalsService } from 'src/app/_services/crm/perposals.service';
import { AddNewPerposalsComponent } from './add-new-perposals/add-new-perposals.component';

@Component({
  selector: 'app-perposals',
  templateUrl: './perposals.component.html',
  styleUrls: ['./perposals.component.sass'],
})
export class PerposalsComponent {
  allPerposals: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private PerposalsService: PerposalsService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getAllPerposals();
  }

  getAllPerposals() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['company_id'] = '';
    data['tags'] = '';
    data['search'] = '';

    this.PerposalsService.getAllPerposals(data).subscribe((res: any) => {
      if (res) {
        this.allPerposals = res['data'];
      }
    });
  }

  addNewPerposals(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Perposals',
      nzContent: AddNewPerposalsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-Perposals',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPerposals();
    });
  }

  viewPerposals(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Perposals',
      nzContent: AddNewPerposalsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-Perposals',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPerposals();
    });
  }

  editPerposals(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Perposals',
      nzContent: AddNewPerposalsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-Perposals',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPerposals();
    });
  }

  deletePerposals(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this Perposals?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.PerposalsService.deletePerposals(id).subscribe((res: any) => {
          if (res) {
            this.getAllPerposals();
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
    this.getAllPerposals();
  }
}
