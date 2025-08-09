import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContactsService } from 'src/app/_services/crm/contacts.service';
import { AddNewContactsComponent } from './add-new-contacts/add-new-contacts.component';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass'],
})
export class ContactsComponent {
  allContacts: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private contactService: ContactsService,
    private modalService: NzModalService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllContacts();
  }

  getAllContacts() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['company_id'] = '';
    data['tags'] = '';
    data['search'] = '';

    this.contactService.getAllContacts(data).subscribe((res: any) => {
      if (res) {
        this.allContacts = res['data'];
      }
    });
  }

  addNewContacts(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Contacts',
      nzContent: AddNewContactsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-Contacts',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllContacts();
    });
  }

  viewContacts(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Contacts',
      nzContent: AddNewContactsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-Contacts',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllContacts();
    });
  }

  editContacts(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Contacts',
      nzContent: AddNewContactsComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-Contacts',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllContacts();
    });
  }

  deleteContacts(data: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this Contacts?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.contactService.deleteContacts(data.id).subscribe((res: any) => {
          if (res) {
            this.getAllContacts();
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
    this.getAllContacts();
  }
}
