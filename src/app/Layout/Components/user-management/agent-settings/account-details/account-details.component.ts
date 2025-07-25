import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.sass']
})
export class AccountDetailsComponent {

  
  switchValue = false;
  checked = true;



  accountDetails!:FormGroup


  tableData = [
  
  ];

  ngOnInit() {

    this.accountDetails = new FormGroup({
      agentName: new FormControl (null),
      wallet: new FormControl (null, Validators.required),
      bank: new FormControl (null, Validators.required),
      accountName: new FormControl (null, Validators.required),
      accountNumber: new FormControl (null, Validators.required),
     
    
    });

  }
  
  updateAccountDetails(){
    console.log(this.accountDetails)
  }



}
