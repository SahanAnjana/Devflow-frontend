import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContractsService } from 'src/app/_services/crm/contracts.service';
import { AddNewContractsComponent } from './add-new-contracts/add-new-contracts.component';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.sass'],
})
export class ContractsComponent {
  allContracts: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private contractsService: ContractsService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllContracts();
  }

  getAllContracts() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['company_id'] = '';
    data['tags'] = '';
    data['search'] = '';

    this.contractsService.getAllContracts(data).subscribe((res: any) => {
      if (res) {
        this.allContracts = res['data'];
      }
    });
  }

  addNewContracts(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Contracts',
      nzContent: AddNewContractsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-Contracts',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllContracts();
    });
  }

  viewContracts(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Contracts',
      nzContent: AddNewContractsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-Contracts',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllContracts();
    });
  }

  editContracts(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Contracts',
      nzContent: AddNewContractsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-Contracts',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllContracts();
    });
  }

  deleteContracts(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this Contracts?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.contractsService.deleteContracts(id).subscribe((res: any) => {
          if (res) {
            this.getAllContracts();
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
    this.getAllContracts();
  }
}
