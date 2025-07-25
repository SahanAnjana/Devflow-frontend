import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { AgentService } from 'src/app/_services/agent.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-add-new-agent-countries',
  templateUrl: './add-new-agent-countries.component.html',
  styleUrls: ['./add-new-agent-countries.component.sass'],
})
export class AddNewAgentCountriesComponent {
  countryList: any[] = [];
  @Input() formGroupName: any;
  form!: FormGroup;
  sendingcurrencydata: any;
  countryNewList: any;
  countryList2: any;
  countryIdList: any;
  constructor(
    private agentService: AgentService,
    private rootFormGroup: FormGroupDirective,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    if (this.dataService.clickEventStatus == 'viewAgent') {
      this.getAllCountries();
      this.getCountry2();
    } else if (this.dataService.clickEventStatus == 'addNewAgent') {
      this.getCountry2();
    }
    this.getCountry();
  }
  getCountry() {
    this.agentService.getcountry('MN').subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.countryList = res['responseDto'];
        }
      },
    });
  }
  getCountry2() {
    this.agentService.getcountry('MN').subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.countryList2 = res['responseDto'];
        }
      },
    });
  }
  getAllCountries() {
    const data: any = {};
    data['exposableId'] = this.dataService.selectedData.agentExposableId;
    this.agentService.getSignUpcountries(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.countryNewList = res['responseDto'];

        this.countryIdList = this.countryNewList.map(
          (country: any) => country.countryId
        );
        this.agentService.selectedCountryList = this.countryIdList;
        console.log('bla', this.countryIdList);
      } else {
        this.countryNewList = [];
      }
    });
  }

  change(event: any) {
    this.agentService.selectedCountryList = event;
  }
  isCountryChecked(countryId: number): boolean {
    return this.countryNewList.some(
      (country: any) => country.clientCountryId === countryId
    );
  }
}
