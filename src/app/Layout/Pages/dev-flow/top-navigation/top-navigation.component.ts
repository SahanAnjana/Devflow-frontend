import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

interface ModuleNavItem {
  name: string;
  icon: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.sass'],
})
export class TopNavigationComponent {
  @Input() userEmail: string = '';
  @Output() logout = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() moduleChange = new EventEmitter<string>();
  @Input() segments: string[] = [];

  isDropdownOpen = false;
  currentUser: any;
  loggeduser: any;

  moduleNavigation: ModuleNavItem[] = [
    { name: 'Dev-flow', icon: '🏠', route: '/devflow', active: true },
    { name: 'HR', icon: '👥', route: '/hr', active: false },
    { name: 'Finance', icon: '💰', route: '/finance', active: false },
    { name: 'Project', icon: '📊', route: '/projects', active: false },
    { name: 'CRM', icon: '🤝', route: '/crm', active: false },
  ];

  constructor(
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private router: Router,
    private dataService: DataService
  ) {
    this.currentUser = this.commonService.parseJwt(tokenService.getToken());
    this.loggeduser = this.currentUser.sub;

    // Listen to route changes and update active module
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateActiveModuleFromRoute((event as NavigationEnd).url);
      });

    // Set initial active module based on current route
    this.updateActiveModuleFromRoute(this.router.url);
  }

  private updateActiveModuleFromRoute(url: string): void {
    // Reset all modules to inactive
    this.moduleNavigation.forEach((module) => (module.active = false));

    // Determine which module should be active based on URL
    if (url.startsWith('/hr')) {
      const hrModule = this.moduleNavigation.find((m) => m.name === 'HR');
      if (hrModule) hrModule.active = true;
    } else if (url.startsWith('/finance')) {
      const financeModule = this.moduleNavigation.find(
        (m) => m.name === 'Finance'
      );
      if (financeModule) financeModule.active = true;
    } else if (url.startsWith('/projects')) {
      const projectModule = this.moduleNavigation.find(
        (m) => m.name === 'Project'
      );
      if (projectModule) projectModule.active = true;
    } else if (url.startsWith('/crm')) {
      const crmModule = this.moduleNavigation.find((m) => m.name === 'CRM');
      if (crmModule) crmModule.active = true;
    } else if (url.startsWith('/devflow') || url === '/') {
      const devflowModule = this.moduleNavigation.find(
        (m) => m.name === 'Dev-flow'
      );
      if (devflowModule) devflowModule.active = true;
    }

    console.log('Active module updated based on route:', url);
  }

  getInitials(email: string): string {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  }

  getBreadcrumbLink(index: number): any[] {
    return ['/', ...this.segments.slice(0, index + 1)];
  }

  onModuleClick(selectedModule: ModuleNavItem): void {
    // Update active state
    this.moduleNavigation.forEach((module) => (module.active = false));
    selectedModule.active = true;

    // Emit module change event
    this.moduleChange.emit(selectedModule.name);

    // Navigate to module route
    this.router.navigate([selectedModule.route]);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onProfileClick() {
    this.profileClick.emit();
    this.isDropdownOpen = false;
  }

  onSettingsClick() {
    this.settingsClick.emit();
    this.isDropdownOpen = false;
  }

  onLogout() {
    this.logout.emit();
    this.isDropdownOpen = false;
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
