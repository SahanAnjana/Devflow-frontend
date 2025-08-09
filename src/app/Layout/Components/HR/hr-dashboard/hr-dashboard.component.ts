import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

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
export class HrDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Debug mode flag
  debugMode = true;

  // Data properties
  dashboardData: HRDashboardData | null = null;
  isLoading = false;
  error: string | null = null;

  // Chart instances
  departmentChart: Chart | null = null;
  statusChart: Chart | null = null;

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

  ngAfterViewInit() {
    if (this.debugMode) console.log('🔧 HR Dashboard ngAfterViewInit called');

    try {
      // Delay chart creation to ensure DOM is ready
      setTimeout(() => {
        this.createDepartmentChart();
        this.createStatusChart();
      }, 100);
    } catch (error) {
      console.error('❌ Error in ngAfterViewInit:', error);
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

    // Safe mock data for testing
    this.dashboardData = {
      total_employees: 45,
      total_departments: 5,
      each_department_employee_count: {
        'IT Department': 12,
        'Human Resources': 8,
        Finance: 10,
        Marketing: 9,
        Operations: 6,
      },
      today_leave_count: 3,
      today_interviews: 2,
      today_onboarding: 1,
      current_job_postings: 5,
    };
  }

  fetchDashboardData() {
    if (this.debugMode) console.log('🔧 Fetching HR dashboard data...');

    this.isLoading = true;
    this.error = null;

    this.http
      .get<HRDashboardData>('http://140.245.213.62:8001/dashboard/')
      .subscribe({
        next: (data) => {
          if (this.debugMode) console.log('✅ HR Data received:', data);
          this.dashboardData = data;
          this.isLoading = false;

          // Create charts after data is loaded
          setTimeout(() => {
            this.createDepartmentChart();
            this.createStatusChart();
          }, 100);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ HR API Error:', error);
          this.isLoading = false;
          this.error = `API Error: ${error.status} - ${error.message}`;

          // Load mock data as fallback
          this.loadMockData();
        },
      });
  }

  private createDepartmentChart() {
    try {
      if (this.debugMode)
        console.log('🔧 Attempting to create department chart');

      const canvas = document.getElementById(
        'departmentChart'
      ) as HTMLCanvasElement;
      if (!canvas) {
        console.warn('⚠️ Department chart canvas element not found');
        return;
      }

      if (this.debugMode)
        console.log('✅ Department chart canvas found, creating chart...');

      // Destroy existing chart if it exists
      if (this.departmentChart) {
        this.departmentChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Prepare data for pie chart
      const departmentData = this.getDepartmentChartData();

      const config: ChartConfiguration = {
        type: 'doughnut' as ChartType,
        data: {
          labels: departmentData.labels,
          datasets: [
            {
              data: departmentData.values,
              backgroundColor: [
                '#3B82F6', // Blue
                '#10B981', // Green
                '#F59E0B', // Amber
                '#EF4444', // Red
                '#8B5CF6', // Purple
                '#06B6D4', // Cyan
              ],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const data = context.dataset.data as number[];
                  const total = data.reduce((a: number, b: number) => a + b, 0);
                  const value = context.parsed as number;
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                  return `${context.label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      };

      this.departmentChart = new Chart(ctx, config);
      console.log('✅ Department chart created successfully');
    } catch (error) {
      console.error('❌ Department chart creation error:', error);
    }
  }

  private createStatusChart() {
    try {
      if (this.debugMode) console.log('🔧 Attempting to create status chart');

      const canvas = document.getElementById(
        'statusChart'
      ) as HTMLCanvasElement;
      if (!canvas) {
        console.warn('⚠️ Status chart canvas element not found');
        return;
      }

      if (this.debugMode)
        console.log('✅ Status chart canvas found, creating chart...');

      // Destroy existing chart if it exists
      if (this.statusChart) {
        this.statusChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Prepare data for bar chart
      const statusData = this.getStatusChartData();

      const config: ChartConfiguration = {
        type: 'bar' as ChartType,
        data: {
          labels: statusData.labels,
          datasets: [
            {
              label: 'Employee Count',
              data: statusData.values,
              backgroundColor: [
                '#10B981', // Green for Active
                '#F59E0B', // Amber for On Leave
                '#3B82F6', // Blue for Interviews
                '#EF4444', // Red for Job Openings
              ],
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  return `${context.label}: ${context.parsed.y}`;
                },
              },
            },
          },
        },
      };

      this.statusChart = new Chart(ctx, config);
      console.log('✅ Status chart created successfully');
    } catch (error) {
      console.error('❌ Status chart creation error:', error);
    }
  }

  private getDepartmentChartData() {
    const departments = this.departmentData;
    return {
      labels: departments.map((dept) => dept.name),
      values: departments.map((dept) => dept.count),
    };
  }

  private getStatusChartData() {
    const activeEmployees = this.totalEmployees - (this.todayLeaves || 0);
    return {
      labels: ['Active', 'On Leave', 'Interviews', 'Job Openings'],
      values: [
        activeEmployees,
        this.todayLeaves || 0,
        this.todayInterviews || 0,
        this.currentJobPostings || 0,
      ],
    };
  }

  // Getter methods with safe defaults
  get totalEmployees(): number {
    return this.dashboardData?.total_employees || 0;
  }

  get totalDepartments(): number {
    return this.dashboardData?.total_departments || 0;
  }

  get todayLeaves(): number {
    return this.dashboardData?.today_leave_count || 0;
  }

  get todayInterviews(): number {
    return this.dashboardData?.today_interviews || 0;
  }

  get currentJobPostings(): number {
    return this.dashboardData?.current_job_postings || 0;
  }

  get todayOnboarding(): number {
    return this.dashboardData?.today_onboarding || 0;
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

  ngOnDestroy() {
    // Clean up chart instances
    if (this.departmentChart) {
      this.departmentChart.destroy();
    }
    if (this.statusChart) {
      this.statusChart.destroy();
    }
  }
}
