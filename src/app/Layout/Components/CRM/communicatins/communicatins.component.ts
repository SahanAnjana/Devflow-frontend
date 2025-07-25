import { Component } from '@angular/core';
import { AddNewCommunicationComponent } from './add-new-communication/add-new-communication.component';
import { CommunicationService } from 'src/app/_services/communication.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommunicationsService } from 'src/app/_services/crm/communications.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-communicatins',
  templateUrl: './communicatins.component.html',
  styleUrls: ['./communicatins.component.sass'],
})
export class CommunicatinsComponent {
  allCommunications: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private communicationService: CommunicationsService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllCommunication();
  }

  getAllCommunication() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['contact_id'] = '';
    data['deal_id'] = '';
    data['company_id'] = '';
    data['communication_type'] = '';
    data['direction'] = '';
    data['date_from'] = '';
    data['date_to'] = '';
    data['search'] = '';
    this.communicationService
      .getAllCommunications(data)
      .subscribe((res: any) => {
        if (res) {
          this.allCommunications = res['data'];
        }
      });
  }

  addNewCommunication(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Communication',
      nzContent: AddNewCommunicationComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-communication',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllCommunication();
    });
  }

  viewCommunication(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Communication',
      nzContent: AddNewCommunicationComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-communication',
    });
    modal.componentInstance!.data = data;
  }

  editCommunication(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Communication',
      nzContent: AddNewCommunicationComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-communication',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllCommunication();
    });
  }

  deleteCommunication(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this communication?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.communicationService
          .deleteCommunications(id)
          .subscribe((res: any) => {
            if (res) {
              this.getAllCommunication();
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
    this.getAllCommunication();
  }
}
