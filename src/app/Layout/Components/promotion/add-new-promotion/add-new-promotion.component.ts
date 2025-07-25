import { Component } from '@angular/core';

@Component({
  selector: 'app-add-new-promotion',
  templateUrl: './add-new-promotion.component.html',
  styleUrls: ['./add-new-promotion.component.sass'],
})
export class AddNewPromotionComponent {
  switchValue = false;
  radioValue = "YES";



  ngOnInit(){
    this.isTransferFeeFn();
  }

  isTransferFeeFn(){
    
    if(this.radioValue === 'NO'){
       this.switchValue = true;
    }
    else{
      this.switchValue = false;
    }
  }

}
