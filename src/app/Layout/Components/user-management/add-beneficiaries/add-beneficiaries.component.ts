import { Component, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { FormGroup } from '@angular/forms';
import { AddNewbeneficiariespersonalComponent } from '../add-newbeneficiariespersonal/add-newbeneficiariespersonal.component';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { AddNewbeneficiariessaveComponent } from '../add-newbeneficiariessave/add-newbeneficiariessave.component';
import { AddNewbeneficiariesComponent } from '../add-newbeneficiaries/add-newbeneficiaries.component';
@Component({
  selector: 'app-add-beneficiaries',
  templateUrl: './add-beneficiaries.component.html',
  styleUrls: ['./add-beneficiaries.component.sass'],
})
export class AddBeneficiariesComponent {
  @ViewChild(AddNewbeneficiariespersonalComponent)
  AddNewbeneficiariespersonalinfo!: AddNewbeneficiariespersonalComponent;

  @ViewChild(AddNewbeneficiariessaveComponent)
  AddNewbeneficiariessaveinfo!: AddNewbeneficiariessaveComponent;

  @ViewChild(AddNewbeneficiariesComponent)
  AddNewbeneficiariesComponentInfo!: AddNewbeneficiariesComponent;

  step = 1;
  //  mySwitchValue = false;
  // isDisabled = true;
  // isNewBeneficiary = true;
  // isNewBank = false;
  // isHide = false;
  transactionForm!: FormGroup;
  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private dataService: DataService
  ) {}

  ngOnInit() {}
  next() {
    if (this.step < 3) this.step++;
  }
  prev() {
    if (this.step > 1) {
      this.step--;
      // Call patchedDatas function of AddNewbeneficiariespersonalComponent
      // this.AddNewbeneficiariespersonalinfo.patchedDatas();
    }
  }

  close() {
    this.AddNewbeneficiariessaveinfo.addNewBank();
    this.dataService.FirstPagesenderSearch = null;
    this.dataService.FirstPageAgntValue = null;
    this.dataService.FirstPagesenderSearch = null;
    this.dataService.FirstPageAgntValue = null;
    this.dataService.nameValue = null;
    //this.modalRef.close();
  }
  backClose() {
    this.modalRef.close();
    this.dataService.FirstPagesenderSearch = null;
    this.dataService.FirstPageAgntValue = null;
    this.dataService.FirstPagesenderSearch = null;
    this.dataService.FirstPageAgntValue = null;
    this.dataService.nameValue = null;
  }

  bla() {
    this.AddNewbeneficiariespersonalinfo.test();
    // this.AddNewbeneficiariespersonalinfo.patchedDatas();
  }

  blaa() {
    this.AddNewbeneficiariesComponentInfo.validateForm();
  }

  blaaa() {
    this.AddNewbeneficiariesComponentInfo.validateForm();
  }
}
