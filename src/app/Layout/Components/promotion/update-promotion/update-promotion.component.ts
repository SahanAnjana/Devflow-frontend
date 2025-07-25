import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-promotion',
  templateUrl: './update-promotion.component.html',
  styleUrls: ['./update-promotion.component.sass'],
})
export class UpdatePromotionComponent {
  switchValue = false;
  radioValue = 'YES';
  updatepromotion!: FormGroup;
  ngOnInit() {
    this.updatepromotion = new FormGroup({
      AgentName: new FormControl(null, Validators.required),
      PromotionName: new FormControl(null, Validators.required),
      PaymentMode: new FormControl(null, Validators.required),
      TransferLimit: new FormControl(null, Validators.required),
      max: new FormControl(null, Validators.required),
      PromotionType: new FormControl(null, Validators.required),
      StartDate: new FormControl(null, Validators.required),
      EndDate: new FormControl(null, Validators.required),
      PromoCodeUsage: new FormControl(null, Validators.required),
      PromoCode: new FormControl(null, Validators.required),
      iffeeltransferapplicable: new FormControl(null, Validators.required),
      Nooffeetransfers: new FormControl(null, Validators.required),
      AmountType: new FormControl(null, Validators.required),
      fixedAmountPercentage: new FormControl(null, Validators.required),
    });
  }
  save() {
    // console.log(this.updatepromotion);
  }

  isTransferFeeFn() {
    // console.log('hari')
    if (this.radioValue === 'NO') {
      this.switchValue = true;
    } else {
      this.switchValue = false;
    }
  }
}
