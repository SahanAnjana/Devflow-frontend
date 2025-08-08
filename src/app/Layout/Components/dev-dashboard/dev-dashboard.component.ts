import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { EventtriggerService } from 'src/app/_services/eventtrigger.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { ProjectsService } from 'src/app/_services/pm-services/projects.service';
import { IssuesService } from 'src/app/_services/pm-services/issues.service';
import { BudgetsService } from 'src/app/_services/finance/budgets.service';
import { CompaniesService } from 'src/app/_services/crm/companies.service';

interface KPIData {
  totalProjects: number;
  openIssues: number;
  revenue: string;
  totalCompanies: number;
}

@Component({
  selector: 'app-dev-dashboard',
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.sass'],
})
export class DevDashboardComponent {
  permissionsMap: { [key: string]: boolean } = {};
  currentUser: any;
  isLoadingProjects = false;
  projectsError = false;
  isLoadingIssues = false;
  issuesError = false;
  isLoadingBudgets = false;
  budgetsError = false;
  isLoadingCompanies = false;
  companiesError = false;
  kpiData: KPIData = {
    totalProjects: 0,
    openIssues: 0,
    revenue: '0.0K',
    totalCompanies: 0,
  };

  constructor(
    private dataService: DataService,
    private eventTriggerService: EventtriggerService,
    private dashboardService: DashboardService,
    private router: Router,
    private tokenService: TokenserviceService,
    private commonService: CommonsService,
    private projectsService: ProjectsService,
    private issuesService: IssuesService,
    private budgetsService: BudgetsService,
    private companiesService: CompaniesService
  ) {
    this.currentUser = this.commonService.parseJwt(
      this.tokenService.getToken()
    );
  }

  ngOnInit() {
    this.getUserDEtails();
    this.loadKPIData();
  }

  loadKPIData() {
    this.loadProjectsCount();
    this.loadIssuesCount();
    this.loadBudgetsRevenue();
    this.loadCompaniesCount();
    // Load other KPI data here as needed
  }

  loadProjectsCount() {
    this.isLoadingProjects = true;

    // Prepare data for the API call - get all projects to count them
    const requestData = {
      skip: 0,
      limit: 1000, // Large limit to get total count
      search: '', // Empty search to get all projects
    };

    this.projectsService.getALlProjects(requestData).subscribe({
      next: (response: any) => {
        console.log('Projects API Response:', response);

        // Update the total projects count based on API response
        if (response && response.data) {
          // If the API returns a count property
          if (response.count !== undefined) {
            this.kpiData.totalProjects = response.count;
          }
          // Otherwise count the items in the data array
          else if (Array.isArray(response.data)) {
            this.kpiData.totalProjects = response.data.length;
          }
          // If response.data is the count itself
          else if (typeof response.data === 'number') {
            this.kpiData.totalProjects = response.data;
          }
        }
        // If response structure is different, try to extract count
        else if (response && typeof response.count === 'number') {
          this.kpiData.totalProjects = response.count;
        } else if (response && Array.isArray(response)) {
          this.kpiData.totalProjects = response.length;
        }

        this.isLoadingProjects = false;
        console.log('Total projects updated:', this.kpiData.totalProjects);
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.isLoadingProjects = false;
        this.projectsError = true;
        // Keep the default value or set to 0 on error
        this.kpiData.totalProjects = 0;
      },
    });
  }

  loadIssuesCount() {
    this.isLoadingIssues = true;

    // Prepare data for the API call - get all issues to count them
    const requestData = {
      skip: 0,
      limit: 1000, // Large limit to get total count
      project_id: null, // Get issues from all projects
      // Add status filter if API supports it
      // status: 'open' // Uncomment if API supports status filtering
    };

    this.issuesService.getALlIssues(requestData).subscribe({
      next: (response: any) => {
        console.log('Issues API Response:', response);

        let issuesCount = 0;

        // Update the open issues count based on API response
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            // Filter for open issues if the data contains status information
            const issues = response.data;
            const openIssues = issues.filter((issue: any) => {
              // Check common status field names for open/unresolved issues
              const status = issue.status || issue.state || issue.is_resolved;
              return (
                status === 'open' ||
                status === 'active' ||
                status === 'pending' ||
                status === 'in_progress' ||
                status === false || // if is_resolved is false
                status === 0 || // if status is numeric (0 = open)
                !issue.is_closed
              ); // if not closed
            });

            issuesCount = openIssues.length;

            // If no status filtering worked, use total count
            if (issuesCount === 0 && issues.length > 0) {
              issuesCount = issues.length;
              console.log(
                'Using total issues count as open issues filter could not be applied'
              );
            }
          } else if (typeof response.data === 'number') {
            issuesCount = response.data;
          }
        }
        // If response has a direct count property
        else if (response && typeof response.count === 'number') {
          issuesCount = response.count;
        }
        // If response is direct array
        else if (response && Array.isArray(response)) {
          issuesCount = response.length;
        }

        this.kpiData.openIssues = issuesCount;
        this.isLoadingIssues = false;
        console.log('Total open issues updated:', this.kpiData.openIssues);
      },
      error: (error) => {
        console.error('Error fetching issues:', error);
        this.isLoadingIssues = false;
        this.issuesError = true;
        // Keep the default value or set to 0 on error
        this.kpiData.openIssues = 0;
      },
    });
  }

  loadBudgetsRevenue() {
    this.isLoadingBudgets = true;

    // Prepare data for the API call - get first 5 budgets
    const requestData = {
      skip: 0,
      limit: 5, // Get first 5 budgets as requested
      project_id: undefined, // Get budgets from all projects
    };

    this.budgetsService.getAllBudgets(requestData).subscribe({
      next: (response: any) => {
        console.log('Budgets API Response:', response);

        let totalRevenue = 0;

        // Calculate total revenue from the first 5 budgets
        if (response && response.data && Array.isArray(response.data)) {
          const budgets = response.data.slice(0, 5); // Ensure we only take first 5

          totalRevenue = budgets.reduce((sum: number, budget: any) => {
            // Try different common budget amount field names
            const amount =
              budget.amount ||
              budget.budget_amount ||
              budget.total ||
              budget.value ||
              budget.allocated_amount ||
              budget.budget ||
              0;

            return sum + (parseFloat(amount) || 0);
          }, 0);

          console.log(
            `Calculated revenue from ${budgets.length} budgets:`,
            totalRevenue
          );
        }
        // If response structure is different
        else if (response && Array.isArray(response)) {
          const budgets = response.slice(0, 5);
          totalRevenue = budgets.reduce((sum: number, budget: any) => {
            const amount =
              budget.amount || budget.budget_amount || budget.total || 0;
            return sum + (parseFloat(amount) || 0);
          }, 0);
        }

        // Format the revenue for display
        this.kpiData.revenue = this.formatCurrency(totalRevenue);
        this.isLoadingBudgets = false;
        console.log('Quarterly revenue updated:', this.kpiData.revenue);
      },
      error: (error) => {
        console.error('Error fetching budgets:', error);
        this.isLoadingBudgets = false;
        this.budgetsError = true;
        // Keep the default value on error
        this.kpiData.revenue = '0.0K';
      },
    });
  }

  private formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else {
      return amount.toFixed(0);
    }
  }

  loadCompaniesCount() {
    this.isLoadingCompanies = true;

    // Prepare data for the API call - get all companies to count them
    const requestData = {
      skip: 1,
      limit: 10, // Large limit to get total count
      search: '', // Empty search to get all companies
      industry: null, // Get companies from all industries
    };

    this.companiesService.getAllCompanies(requestData).subscribe({
      next: (response: any) => {
        console.log('Companies API Response:', response);

        // Update the total companies count based on API response
        if (response && response.data) {
          // If the API returns a count property
          if (response.count !== undefined) {
            this.kpiData.totalCompanies = response.count;
          }
          // Otherwise count the items in the data array
          else if (Array.isArray(response.data)) {
            this.kpiData.totalCompanies = response.data.length;
          }
          // If response.data is the count itself
          else if (typeof response.data === 'number') {
            this.kpiData.totalCompanies = response.data;
          }
        }
        // If response structure is different, try to extract count
        else if (response && typeof response.count === 'number') {
          this.kpiData.totalCompanies = response.count;
        } else if (response && Array.isArray(response)) {
          this.kpiData.totalCompanies = response.length;
        }

        this.isLoadingCompanies = false;
        console.log('Total companies updated:', this.kpiData.totalCompanies);
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
        this.isLoadingCompanies = false;
        this.companiesError = true;
        // Keep the default value or set to 0 on error
        this.kpiData.totalCompanies = 0;
      },
    });
  }

  startNewProject() {
    console.log('Starting new project...');
    
    // Set the sidebar to project mode
    this.dataService.sidebarItem = 'project';
    
    // Navigate to projects module
    this.router.navigate(['/projects/projects']).then(() => {
      // After navigation is complete, trigger the add new project modal
      setTimeout(() => {
        this.eventTriggerService.onReloadServiceData('openAddProjectModal');
      }, 100);
    });
  }

  navigateToDepartment(value: string) {
    this.dataService.sidebarItem = value; // set selected department
    console.log('value', value);

    // Navigate to corresponding dashboard route
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
