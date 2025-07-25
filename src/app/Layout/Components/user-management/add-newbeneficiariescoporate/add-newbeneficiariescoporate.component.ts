import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-newbeneficiariescoporate',
  templateUrl: './add-newbeneficiariescoporate.component.html',
  styleUrls: ['./add-newbeneficiariescoporate.component.sass'],
})
export class AddNewbeneficiariescoporateComponent {
  currentIndex = 0;
  prev(): void {
    this.currentIndex = 0;
  }

  next() {
    this.currentIndex = this.currentIndex + 1;
  }
  isCoporate = '';
  switchValue = false;
  beceficiarycorporate!: FormGroup;
  ngOnInit() {
    this.beceficiarycorporate = new FormGroup({
      CompanyName: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
      ContactNumber: new FormControl(null, Validators.required),
      code1: new FormControl(null, Validators.required),
      MobileNumber: new FormControl(null, Validators.required),
      Address: new FormControl(null, Validators.required),
    });
  }
}
