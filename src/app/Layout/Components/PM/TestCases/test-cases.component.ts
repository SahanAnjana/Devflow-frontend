import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddNewTestCaseComponent } from './add-new-test-case/add-new-test-case.component';
import { TestcasesService } from 'src/app/_services/pm-services/testcases.service';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.sass'],
})
export class TestCasesComponent {
  allTestCasesList: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 20;
  totalRecord: number = 0;
  currentPageIndex = 1;

  constructor(
    private dataService: DataService,
    private modalService: NzModalService,
    private testCasesService: TestcasesService
  ) {}

  ngOnInit() {
    this.getAllTestCases();
  }

  getAllTestCases() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['project_id'] = '090b9e6f-bd76-4e45-8c6b-986e8cfcd602';
    // data['category'] = this.pageNumber;
    // data['priority'] = this.pageSize;
    // data['status'] = 'gayan';
    this.testCasesService.getALlTestCases(data).subscribe((res: any) => {
      if (res) {
        this.allTestCasesList = res['data'];
      }
    });
  }

  addNewTestCase() {
    const modal = this.modalService.create({
      nzTitle: 'Create New Test Case',
      nzContent: AddNewTestCaseComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'create-test-case',
    });

    modal.afterClose.subscribe((result: any) => {
      if (result) {
        // Add the new test case to the list
        this.allTestCasesList = [...this.allTestCasesList, result];
        // TODO: Integrate with actual API when available
      }
    });
  }

  viewTestCase(data: any) {
    // TODO: Implement view test case modal
    console.log('View test case:', data);
  }

  editTestCase(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Test Case',
      nzContent: AddNewTestCaseComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-test-case',
    });

    modal.componentInstance!.data = data;
    modal.componentInstance!.index = this.allTestCasesList.findIndex(
      (item) => item.id === data.id
    );

    modal.afterClose.subscribe((result: any) => {
      if (result) {
        // Update the test case in the list
        const index = this.allTestCasesList.findIndex(
          (item) => item.id === result.id
        );
        if (index !== -1) {
          this.allTestCasesList[index] = result;
          this.allTestCasesList = [...this.allTestCasesList]; // Trigger change detection
        }
        // TODO: Integrate with actual API when available
      }
    });
  }

  deleteTestCase(id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this test case?',
      nzContent: 'This action cannot be undone.',
      nzIconType: 'warning',
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No, Cancel',
      nzOnOk: () => {
        // TODO: Implement actual delete API call
        console.log('Deleting test case:', id);
        this.testCasesService.deleteTestCases(id).subscribe((res: any) => {
          if (res['data']) {
            this.getAllTestCases();
          }
        });
      },
    });
  }

  pageIndexChange(selectedIndex: number) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    // TODO: Implement pagination
  }
}
