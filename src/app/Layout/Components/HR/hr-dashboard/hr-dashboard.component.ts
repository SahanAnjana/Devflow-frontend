import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface HRDashboardData {
  total_employees: number;
  total_departments: number;
  each_department_employee_count: { [key: string]: number };
  today_leave_count: number;
  today_interviews: number;
  today_onboarding: number;
  current_job_postings: number;
}

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.sass'],
})
export class HrDashboardComponent implements OnInit {
  // Debug mode flag
  debugMode = true;

  // Data properties
  dashboardData: HRDashboardData | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    if (this.debugMode) console.log('🔧 HR Dashboard constructor called');
  }

  ngOnInit() {
    if (this.debugMode) console.log('🔧 HR Dashboard ngOnInit called');

    try {
      // Initialize with safe defaults
      this.initializeDefaults();

      // Only fetch data if not in debug mode
      if (!this.debugMode) {
        this.fetchDashboardData();
      } else {
        console.log('🔧 Debug mode: Skipping API call');
        this.loadMockData();
      }
    } catch (error) {
      console.error('❌ Error in ngOnInit:', error);
      this.error = 'Error initializing HR Dashboard';
    }
  }

  private initializeDefaults() {
    if (this.debugMode) console.log('🔧 Initializing defaults');

    // Set safe default values
    this.dashboardData = {
      total_employees: 0,
      total_departments: 0,
      each_department_employee_count: {},
      today_leave_count: 0,
      today_interviews: 0,
      today_onboarding: 0,
      current_job_postings: 0,
    };
  }

  private loadMockData() {
    if (this.debugMode) console.log('🔧 Loading mock data');

    // Mock data for testing
    this.dashboardData = {
      total_employees: 156,
      total_departments: 8,
      each_department_employee_count: {
        Engineering: 45,
        Sales: 32,
        Marketing: 28,
        HR: 15,
        Finance: 12,
        Operations: 18,
        Support: 6,
      },
      today_leave_count: 8,
      today_interviews: 3,
      today_onboarding: 2,
      current_job_postings: 12,
    };

    if (this.debugMode) console.log('✅ Mock data loaded successfully');
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.error = null;

    this.http.get<HRDashboardData>('/api/hr/dashboard').subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        console.log('✅ HR Dashboard data loaded successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error fetching HR dashboard data:', error);
        this.error = 'Failed to load HR dashboard data';
        this.isLoading = false;
        // Fall back to mock data
        this.loadMockData();
      },
    });
  }

  // Getter methods for template
  get totalEmployees(): number {
    return this.dashboardData?.total_employees || 0;
  }

  get totalDepartments(): number {
    return this.dashboardData?.total_departments || 0;
  }

  get todayLeaveCount(): number {
    return this.dashboardData?.today_leave_count || 0;
  }

  get todayInterviews(): number {
    return this.dashboardData?.today_interviews || 0;
  }

  get todayOnboarding(): number {
    return this.dashboardData?.today_onboarding || 0;
  }

  get currentJobPostings(): number {
    return this.dashboardData?.current_job_postings || 0;
  }

  get departmentData() {
    if (!this.dashboardData?.each_department_employee_count) {
      return [];
    }

    return Object.entries(this.dashboardData.each_department_employee_count)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Navigation methods
  navigateToEmployees(): void {
    this.router.navigate(['/hr/employees']);
  }
}
