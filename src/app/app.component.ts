import { Component } from '@angular/core';
import { DataService } from './_services/shared-data/data.service';
import { TokenserviceService } from './_services/tokenservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'bankoyo-moneytransfer-admin-ui';

  constructor(
    public dataService: DataService,
    private tokenService: TokenserviceService
  ) {}

  ngOnInit() {
    const savedPermissions = this.tokenService.getPrivileges();
    console.log('permisions', savedPermissions);
    if (savedPermissions) {
      this.dataService.permisions = savedPermissions;
    }
  }
}
