import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PositionsService } from 'src/app/_services/hr-services/positions.service';
import { AddNewPositionComponent } from './add-new-position/add-new-position.component';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.sass'],
})
export class PositionsComponent {
  allpositions: any;

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;
  constructor(
    private positionService: PositionsService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.getAllPoeitions();
  }

  getAllPoeitions() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    this.positionService.getAllPositions(data).subscribe((res) => {
      this.allpositions = res;
    });
  }

  addnewPosition(index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Create Position',
      nzContent: AddNewPositionComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'add-position',
    });
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPoeitions();
    });
  }

  editPosition(data: any, index: any) {
    const modal = this.modalService.create({
      nzTitle: 'Edit Position',
      nzContent: AddNewPositionComponent,
      nzFooter: null,
      nzWidth: 800,
      nzClassName: 'edit-position',
    });
    modal.componentInstance!.data = data;
    modal.componentInstance!.index = index;
    modal.afterClose.subscribe((res: any) => {
      this.getAllPoeitions();
    });
  }

  deletePosition(data: any) {
    this.positionService.deletePosition(data.id).subscribe((res) => {
      if (res) {
        this.getAllPoeitions();
      }
    });
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllPoeitions();
  }
}
