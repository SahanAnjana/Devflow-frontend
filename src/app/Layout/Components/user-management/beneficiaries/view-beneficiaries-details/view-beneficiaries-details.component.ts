import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BenificiaryService } from 'src/app/_services/benificiary.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-view-beneficiaries-details',
  templateUrl: './view-beneficiaries-details.component.html',
  styleUrls: ['./view-beneficiaries-details.component.sass'],
})
export class ViewBeneficiariesDetailsComponent {
  @Input() mode: any = {};
  @Input() type!: 'view';

  selectedBeniId: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  countryId: any;
  selectedCountryId: any;
  isCoporate: any;
  valuseofisCoporate: any;

  constructor(
    private dataService: DataService,
    private benificiaryService: BenificiaryService
  ) {}

  ngOnInit() {
    //this.dataService.selectedBeniID=this.mode.benificiaryDetailsId

    console.log('plz work', this.mode.agentBeneficiaryId);

    this.selectedBeniId = this.mode.agentBeneficiaryId;
    this.selectedCountryId = this.countryId;
    this.dataService.BenificieryID = this.mode.agentBeneficiaryId;
    this.dataService.benificieryName = this.mode.beneficiaryFirstName;
    this.valuseofisCoporate = this.mode.isCoporateBeneficiary;

    this.getBasicData();
    console.log('corporate user id', this.type);
  }

  getBasicData() {
    const data: any = {};
    data['benificiaryid'] = this.mode.agentBeneficiaryId;
    this.benificiaryService
      .getBasicData(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res['responseDto']) {
            this.countryId = res['responseDto']['countryId'];
            this.isCoporate = res['responseDto']['isCorporate'];

            //this.dataService.beniCountryId=this.countryId
          }

          //this.dataService.beniCountryId=this.countryId
          //this.getBenificieryCountries()
        },
      });
  }
}
