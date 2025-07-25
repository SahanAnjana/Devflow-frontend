import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-dev-dashboard',
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.sass'],
})
export class DevDashboardComponent {
  permissionsMap: { [key: string]: boolean } = {};
  constructor(
    private dataService: DataService,
    private eventTriggerService: EventtriggerService,
    private dashboardService: DashboardService,
    private router: Router,
    private tokenService: TokenserviceService
  ) {}

  ngOnInit() {
    this.getUserDEtails();
  }

  navigateToDepartment(value: string) {
    this.dataService.sidebarItem = value; // set selected department
    console.log('value', value);
    // navigate to corresponding dashboard route
    switch (value) {
      case 'hr':
        this.router.navigate(['/hr']);
        break;
      case 'finance':
        this.router.navigate(['/finance']);
        break;
      case 'project':
        this.router.navigate(['/projects']);
        break;
      case 'crm':
        this.router.navigate(['/crm']);
        break;
    }

    this.eventTriggerService.onReloadServiceData('brandTitle');
  }

  getUserDEtails() {
    const data: any = {};
    this.dashboardService.getuserdetails().subscribe({
      next: (res) => {
        if (res) {
          console.log('roleId', res['role']);
          this.dataService.userId = res['id'];
          this.getPrivilages(res['role']);
        }
      },
    });
  }
  getPrivilages(rolename: string) {
    this.dashboardService.getPrivilagesRole(rolename).subscribe({
      next: (res) => {
        if (res) {
          console.log('roleId', res['permissions']);

          res.permissions.map((permission: any) => {
            this.dataService.permisions[permission] = true;
          });
          this.tokenService.savePrivileges(this.dataService.permisions);
          console.log('Converted Permissions:', this.dataService.permisions);
        }
      },
    });
  }
}
