import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-dev-flow',
  templateUrl: './dev-flow.component.html',
  styleUrls: ['./dev-flow.component.sass'],
})
export class DevFlowComponent {
  @Input() userEmail: string | null = '';
  @Output() logout = new EventEmitter<void>();

  managementType = 'admin';
  activeSection = 'dashboard';
  sidebarItems: any = [];
  urlLink: any;
  mainSegments: any;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private tokenService: TokenserviceService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const segments = this.router.url.split('/');
        this.mainSegments = this.router.url.split('/').slice(1);

        console.log('this.activeSection', segments);
        const urlSegment =
          segments.length === 2 || segments.length > 2
            ? segments[1]
            : 'projects'; // default fallback
        console.log('this.activeSection', urlSegment);
        this.setSidebarItems(urlSegment);
        this.urlLink = urlSegment;
        this.activeSection = segments.length > 2 ? segments[2] : 'dashboard';
      });
  }
  setSidebarItems(section: string) {
    switch (section) {
      case 'devflow':
        this.sidebarItems = [];
        break;
      case 'projects':
        this.sidebarItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'projects', label: 'Projects', icon: 'Projects' },
          { id: 'tasks', label: 'Tasks', icon: 'Tasks' },
          { id: 'resources', label: 'Resources', icon: 'Resources' },
          { id: 'issues', label: 'Issues', icon: 'Issues' },
          { id: 'timeline', label: 'Timeline', icon: 'Timeline' },
          { id: 'team', label: 'Team', icon: 'Team' },
          { id: 'testcases', label: 'Test Cases', icon: 'Testcases' },
          { id: 'reports', label: 'Reports', icon: 'Reports' },
        ];
        break;
      case 'hr':
        this.sidebarItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'employees', label: 'Employees', icon: 'employees' },
          { id: 'departments', label: 'Departments', icon: 'Departments' },
          { id: 'positions', label: 'Positions', icon: 'Positions' },
          {
            id: 'leaves',
            label: 'Leaves',
            icon: 'leaves',
          },
          { id: 'performance', label: 'Performance', icon: 'performance' },
          { id: 'interview', label: 'Interview', icon: 'interview' },
          { id: 'jobposting', label: 'Job Posting', icon: 'jobposting' },
          {
            id: 'jobapplication',
            label: 'Job Application',
            icon: 'jobapplication',
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: 'reports',
          },
        ];
        break;
      case 'finance':
        this.sidebarItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'accounts', label: 'Accounts', icon: 'Accounts' },
          { id: 'budgets', label: 'Budgets', icon: 'Budgets' },
          { id: 'expenses', label: 'Expenses', icon: 'Expenses' },
          { id: 'invoices', label: 'Invoices', icon: 'Invoices' },
          { id: 'reports', label: 'Reports', icon: 'Reports' },
        ];
        break;
      case 'crm':
        this.sidebarItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'companies', label: 'Companies', icon: 'Companies' },

          { id: 'activities', label: 'Activities', icon: 'Activities' },
          { id: 'contracts', label: 'Contracts', icon: 'Contracts' },
          { id: 'contacts', label: 'Contacts', icon: 'Contacts' },
          {
            id: 'communications',
            label: 'Communications',
            icon: 'Communications',
          },
          {
            id: 'perposals',
            label: 'Perposals',
            icon: 'perposals',
          },
          {
            id: 'deals',
            label: 'Deals',
            icon: 'deals',
          },
        ];
        break;
      default:
        this.sidebarItems = [];
    }
  }

  ngOninit() {
    this.getUserDEtails();
  }

  onSectionChange(section: string) {
    this.activeSection = section;
    if (this.urlLink === 'projects') {
      switch (section) {
        case 'dashboard':
          this.router.navigate(['/projects']);
          break;
        case 'projects':
          this.router.navigate(['/projects/projects']);
          break;
        case 'tasks':
          this.router.navigate(['/projects/tasks']);
          break;
        case 'issues':
          this.router.navigate(['/projects/issues']);
          break;
        case 'resources':
          this.router.navigate(['/projects/resources']);
          break;
        case 'timeline':
          this.router.navigate(['/projects/timeline']);
          break;
        case 'team':
          this.router.navigate(['/projects/team']);
          break;
        case 'testcases':
          this.router.navigate(['/projects/testcases']);
          break;
        case 'reports':
          this.router.navigate(['/projects/reports']);
          break;
      }
    } else if (this.urlLink === 'hr') {
      switch (section) {
        case 'dashboard':
          this.router.navigate(['/hr']);
          break;
        case 'employees':
          this.router.navigate(['/hr/employees']);
          break;
        case 'departments':
          this.router.navigate(['/hr/departments']);
          break;
        case 'positions':
          this.router.navigate(['/hr/positions']);
          break;
        case 'leaves':
          this.router.navigate(['/hr/leaves']);
          break;
        case 'performance':
          this.router.navigate(['/hr/performance']);
          break;
        case 'interview':
          this.router.navigate(['/hr/interview']);
          break;

        case 'jobposting':
          this.router.navigate(['/hr/jobposting']);
          break;
        case 'jobapplication':
          this.router.navigate(['/hr/jobapplication']);
          break;
        case 'reports':
          this.router.navigate(['/hr/reports']);
          break;
      }
    } else if (this.urlLink === 'crm') {
      switch (section) {
        case 'dashboard':
          this.router.navigate(['/crm']);
          break;
        case 'companies':
          this.router.navigate(['/crm/companies']);
          break;
        case 'activities':
          this.router.navigate(['/crm/activities']);
          break;
        case 'contracts':
          this.router.navigate(['/crm/contracts']);
          break;
        case 'contacts':
          this.router.navigate(['/crm/contacts']);
          break;
        case 'communications':
          this.router.navigate(['/crm/communications']);
          break;
        case 'perposals':
          this.router.navigate(['/crm/perposals']);
          break;
        case 'deals':
          this.router.navigate(['/crm/deals']);
          break;
      }
    } else if (this.urlLink === 'finance') {
      switch (section) {
        case 'dashboard':
          this.router.navigate(['/finance']);
          break;
        case 'accounts':
          this.router.navigate(['/finance/accounts']);
          break;
        case 'budgets':
          this.router.navigate(['/finance/budgets']);
          break;
        case 'expenses':
          this.router.navigate(['/finance/expenses']);
          break;
        case 'invoices':
          this.router.navigate(['/finance/invoices']);
          break;
        case 'reports':
          this.router.navigate(['/finance/reports']);
          break;
      }
    }
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

  onLogout() {
    this.logout.emit();
  }

  onProfileClick() {
    console.log('Profile clicked');
  }

  onSettingsClick() {
    this.activeSection = 'settings';
  }

  private handleTableAction(action: string, row: any) {
    console.log(`${action} action for:`, row);
  }
}
