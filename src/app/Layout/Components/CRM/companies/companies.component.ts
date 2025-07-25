import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CompaniesService } from 'src/app/_services/crm/companies.service';
import { AddNewCompanyComponent } from './add-new-company/add-new-company.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.sass'],
})
export class CompaniesComponent {
  allCompanies: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private companyService: CompaniesService,
    private modalService: NzModalService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit() {
    this.getAllCompanies();
  }

  getAllCompanies() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['contact_id'] = '';
    data['deal_id'] = '';
    data['company_id'] = '';
    data['Companies_type'] = '';
    data['direction'] = '';
    data['date_from'] = '';
    data['date_to'] = '';
    data['search'] = '';
    this.companyService.getAllCompanies(data).subscribe((res: any) => {
      if (res) {
        this.allCompanies = res['data'];
      }
    });
  }

  addNewCompanies(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Companies',
      nzContent: AddNewCompanyComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-Companies',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllCompanies();
    });
  }

  viewCompanies(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'View Companies',
      nzContent: AddNewCompanyComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'view-Companies',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllCompanies();
    });
  }

  editCompanies(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Companies',
      nzContent: AddNewCompanyComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-Companies',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllCompanies();
    });
  }

  deleteCompanies(data: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this Companies?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.companyService.deleteCompanies(data.id).subscribe((res: any) => {
          if (res['message']) {
            this.notificationService.create(
              'success',
              'Success',
              res['message'],
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
            this.getAllCompanies();
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
    this.getAllCompanies();
  }
}
