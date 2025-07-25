import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent {
  brandTitle = 'Admin Panel';
  @Input() items: Array<{ id: string; label: string; icon: string }> = [];
  @Input() activeItem: string = 'dashboard';
  @Output() itemClick = new EventEmitter<string>();

  navigationItems: { id: string; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  ];

  constructor(
    private dataservice: DataService,
    private eventTriggerService: EventtriggerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventTriggerService.executeOnchangeFunction.subscribe((value) => {
      if (value === 'brandTitle') {
        this.showbrandtitle();
        this.changeSidenavigations();
      }
    });
  }

  onItemClick(itemId: string) {
    console.log('onItemClick', itemId);
    this.itemClick.emit(itemId);
  }
  navigateToDashboard() {
    this.router.navigate(['/']);
  }

  getIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      home: '🏠',
      users: '👥',
      package: '📦',
      'shopping-cart': '🛒',
      'bar-chart-3': '📊',
      'file-text': '📄',
      settings: '⚙️',
    };
    return iconMap[iconName] || '•';
  }
  showbrandtitle() {
    console.log('working');
    if (this.dataservice.sidebarItem == 'admin') {
      this.brandTitle = 'Admin Panel';
      this.navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      ];
    } else if (this.dataservice.sidebarItem == 'hr') {
      this.brandTitle = 'HR Management';
      this.navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'employees', label: 'Employees', icon: 'employees' },
        { id: 'departments', label: 'Departments', icon: 'Departments' },
        { id: 'positions', label: 'Positions', icon: 'Positions' },
        { id: 'leaveRequests', label: 'Leave Requests', icon: 'leaveRequests' },
        { id: 'perforamance', label: 'Perforamance', icon: 'Perforamance' },
      ];
    } else if (this.dataservice.sidebarItem == 'finance') {
      this.brandTitle = 'FINANCE Management';
      this.navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'accounts', label: 'Accounts', icon: 'Accounts' },
        { id: 'budgets', label: 'Budgets', icon: 'Budgets' },
        { id: 'expenses', label: 'Expenses', icon: 'Expenses' },
        { id: 'invoices', label: 'Invoices', icon: 'Invoices' },
        { id: 'reports', label: 'Reports', icon: 'Reports' },
      ];
    } else if (this.dataservice.sidebarItem == 'project') {
      this.brandTitle = 'PM Management';
      this.navigationItems = [
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
    } else if (this.dataservice.sidebarItem == 'crm') {
      this.brandTitle = 'CRM Management';
      this.navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'companies', label: 'Companies', icon: 'Companies' },
        { id: 'deals', label: 'Deals', icon: 'Deals' },
        { id: 'activities', label: 'Activities', icon: 'Activities' },
        { id: 'contracts', label: 'Contracts', icon: 'Contracts' },
        { id: 'contacts', label: 'Contacts', icon: 'Contacts' },
        {
          id: 'communications',
          label: 'Communications',
          icon: 'Communications',
        },
        {
          id: 'deals',
          label: 'Deals',
          icon: 'deals',
        },
      ];
    }
  }

  changeSidenavigations() {
    if (this.dataservice.sidebarItem === 'project') {
    }
  }
}
