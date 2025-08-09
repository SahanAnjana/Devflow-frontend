import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

interface PMDashboardData {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  team_productivity: number;
  on_time_delivery: number;
}

interface ProjectActivity {
  title: string;
  description: string;
  type: 'completed' | 'milestone' | 'started' | 'delayed';
  time: string;
}

@Component({
  selector: 'app-pm-dashboard',
  templateUrl: './pm-dashboard.component.html',
  styleUrls: ['./pm-dashboard.component.sass'],
})
export class PmDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Chart canvas references
  @ViewChild('projectStatusChart', { static: false })
  projectStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('taskProgressChart', { static: false })
  taskProgressChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productivityChart', { static: false })
  productivityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timelineChart', { static: false })
  timelineChartRef!: ElementRef<HTMLCanvasElement>;

  // Chart instances
  private projectStatusChart: Chart | null = null;
  private taskProgressChart: Chart | null = null;
  private productivityChart: Chart | null = null;
  private timelineChart: Chart | null = null;
  // Debug mode flag
  debugMode = true;

  // API data
  dashboardData: PMDashboardData | null = null;
  isLoading = false;
  error: string | null = null;

  // Component lifecycle
  private componentDestroyed = false;

  // Chart data (simplified for performance)
  chartDataSets = [
    [100, 120, 110, 140, 160, 180, 200], // Total Users
    [450, 500, 510, 530, 550, 560, 5678], // Total Orders
    [10000, 11000, 10500, 12000, 12345], // Revenue
    [15, 16, 17, 19, 18.2], // Growth Rate
  ];

  // Computed properties for KPI cards
  get activeProjects(): number {
    return this.dashboardData?.active_projects ?? 42;
  }

  get completedTasks(): number {
    return this.dashboardData?.completed_tasks ?? 1247;
  }

  get teamProductivity(): number {
    return this.dashboardData?.team_productivity ?? 87.3;
  }

  get onTimeDelivery(): number {
    return this.dashboardData?.on_time_delivery ?? 92.6;
  }

  get totalProjects(): number {
    return this.dashboardData?.total_projects ?? 55;
  }

  get totalTasks(): number {
    return this.dashboardData?.total_tasks ?? 1520;
  }

  get pendingTasks(): number {
    return this.dashboardData?.pending_tasks ?? 273;
  }

  // Recent project activities
  recentProjectActivities: ProjectActivity[] = [
    {
      title: 'Task Completed',
      description: 'E-commerce Platform - User Authentication',
      type: 'completed',
      time: '1 hour ago',
    },
    {
      title: 'Milestone Reached',
      description: 'Mobile App - Beta Testing Phase',
      type: 'milestone',
      time: '3 hours ago',
    },
    {
      title: 'Project Started',
      description: 'Website Redesign - Discovery Phase',
      type: 'started',
      time: '1 day ago',
    },
    {
      title: 'Task Delayed',
      description: 'API Integration - Database Optimization',
      type: 'delayed',
      time: '2 days ago',
    },
  ];

  // Sprint data
  currentSprint = {
    name: 'Sprint 23',
    completed: 23,
    total: 30,
    percentage: 77,
    endDate: '2025-08-15',
  };

  // Team members data
  teamMembers = [
    {
      name: 'John Doe',
      role: 'Frontend Developer',
      tasksCompleted: 8,
      tasksTotal: 10,
      efficiency: 92,
    },
    {
      name: 'Jane Smith',
      role: 'Backend Developer',
      tasksCompleted: 6,
      tasksTotal: 8,
      efficiency: 88,
    },
    {
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      tasksCompleted: 5,
      tasksTotal: 6,
      efficiency: 95,
    },
  ];

  constructor(private http: HttpClient, private router: Router) {
    if (this.debugMode) console.log('🔧 PM Dashboard constructor called');

    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    if (this.debugMode) console.log('🔧 PM Dashboard ngOnInit called');

    try {
      this.initializeDefaults();

      if (!this.debugMode) {
        this.fetchDashboardData();
      } else {
        console.log('🔧 Debug mode: Loading mock PM data');
        this.loadMockData();
      }
    } catch (error) {
      console.error('❌ Error in PM ngOnInit:', error);
      this.error = 'Error initializing PM Dashboard';
    }
  }

  ngAfterViewInit(): void {
    if (this.debugMode) console.log('🔧 PM Dashboard ngAfterViewInit called');

    // Wait a bit for the view to be fully rendered, then create charts
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.debugMode) console.log('🔧 PM Dashboard ngOnDestroy called');
    this.componentDestroyed = true;

    // Clean up charts
    this.destroyCharts();
  }

  private initializeDefaults(): void {
    if (this.debugMode) console.log('🔧 Initializing PM defaults');

    // Set safe default values
    this.dashboardData = {
      total_projects: 0,
      active_projects: 0,
      completed_projects: 0,
      total_tasks: 0,
      completed_tasks: 0,
      pending_tasks: 0,
      team_productivity: 0,
      on_time_delivery: 0,
    };
  }

  private loadMockData(): void {
    if (this.debugMode) console.log('🔧 Loading mock PM data');

    this.dashboardData = {
      total_projects: 55,
      active_projects: 42,
      completed_projects: 13,
      total_tasks: 1520,
      completed_tasks: 1247,
      pending_tasks: 273,
      team_productivity: 87.3,
      on_time_delivery: 92.6,
    };

    console.log('✅ Mock PM data loaded');
  }

  fetchDashboardData(): void {
    if (this.debugMode) console.log('🔧 Fetching PM dashboard data...');

    this.isLoading = true;
    this.error = null;

    // Note: Replace with actual PM API endpoint when available
    this.http
      .get<PMDashboardData>('http://140.245.213.62:8003/dashboard/')
      .subscribe({
        next: (data) => {
          if (this.debugMode) console.log('✅ PM Data received:', data);
          this.dashboardData = data;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ PM API Error:', error);
          this.isLoading = false;
          this.error = `PM API Error: ${error.status} - ${error.message}`;

          // Load mock data as fallback
          this.loadMockData();
        },
      });
  }

  // Chart Methods
  private createCharts(): void {
    if (this.debugMode) console.log('🔧 Creating PM dashboard charts');

    try {
      this.createProjectStatusChart();
      this.createTaskProgressChart();
      this.createProductivityChart();
      this.createTimelineChart();
    } catch (error) {
      console.error('❌ Error creating charts:', error);
    }
  }

  private createProjectStatusChart(): void {
    if (!this.projectStatusChartRef?.nativeElement) return;

    const ctx = this.projectStatusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Active Projects', 'Completed Projects'],
      datasets: [
        {
          data: [
            this.activeProjects,
            this.dashboardData?.completed_projects ?? 13,
          ],
          backgroundColor: ['#1890ff', '#52c41a'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                const total = (context.dataset.data as number[]).reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    };

    this.projectStatusChart = new Chart(ctx, config);
  }

  private createTaskProgressChart(): void {
    if (!this.taskProgressChartRef?.nativeElement) return;

    const ctx = this.taskProgressChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Completed', 'Pending', 'In Progress'],
      datasets: [
        {
          label: 'Tasks',
          data: [
            this.completedTasks,
            this.pendingTasks,
            this.totalTasks - this.completedTasks - this.pendingTasks,
          ],
          backgroundColor: ['#52c41a', '#faad14', '#1890ff'],
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f0f0f0',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.parsed.y} tasks`;
              },
            },
          },
        },
      },
    };

    this.taskProgressChart = new Chart(ctx, config);
  }

  private createProductivityChart(): void {
    if (!this.productivityChartRef?.nativeElement) return;

    const ctx = this.productivityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const productivityValue = this.teamProductivity;
    const remaining = 100 - productivityValue;

    const data = {
      labels: ['Productivity', 'Remaining'],
      datasets: [
        {
          data: [productivityValue, remaining],
          backgroundColor: ['#722ed1', '#f5f5f5'],
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    };

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (context.dataIndex === 0) {
                  return `Team Productivity: ${context.parsed}%`;
                }
                return '';
              },
            },
          },
        },
      },
      plugins: [
        {
          id: 'centerText',
          beforeDraw: (chart) => {
            const { ctx, width, height } = chart;
            ctx.restore();
            const fontSize = (height / 114).toFixed(2);
            ctx.font = `bold ${fontSize}em sans-serif`;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#722ed1';

            const text = `${productivityValue}%`;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();
          },
        },
      ],
    };

    this.productivityChart = new Chart(ctx, config);
  }

  private createTimelineChart(): void {
    if (!this.timelineChartRef?.nativeElement) return;

    const ctx = this.timelineChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [
        {
          label: 'Tasks Completed',
          data: [45, 62, 78, 85, 92, 98],
          borderColor: '#52c41a',
          backgroundColor: 'rgba(82, 196, 26, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Project Milestones',
          data: [20, 35, 45, 60, 75, 85],
          borderColor: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#f0f0f0',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
      },
    };

    this.timelineChart = new Chart(ctx, config);
  }

  private destroyCharts(): void {
    if (this.projectStatusChart) {
      this.projectStatusChart.destroy();
      this.projectStatusChart = null;
    }
    if (this.taskProgressChart) {
      this.taskProgressChart.destroy();
      this.taskProgressChart = null;
    }
    if (this.productivityChart) {
      this.productivityChart.destroy();
      this.productivityChart = null;
    }
    if (this.timelineChart) {
      this.timelineChart.destroy();
      this.timelineChart = null;
    }
  }

  // Navigation methods
  navigateToProjects(): void {
    this.router.navigate(['/pm/projects']);
  }

  navigateToTasks(): void {
    this.router.navigate(['/pm/tasks']);
  }

  navigateToTeam(): void {
    this.router.navigate(['/pm/team']);
  }

  navigateToReports(): void {
    this.router.navigate(['/pm/reports']);
  }

  // Quick action methods
  createNewProject(): void {
    this.router.navigate(['/pm/projects/new']);
  }

  addTask(): void {
    this.router.navigate(['/pm/tasks/new']);
  }

  assignTeamMember(): void {
    this.router.navigate(['/pm/team/assign']);
  }

  scheduleMeeting(): void {
    this.router.navigate(['/pm/meetings/new']);
  }

  // Activity methods
  viewAllActivities(): void {
    this.router.navigate(['/pm/activities']);
  }

  // Sprint methods
  viewSprintDetails(): void {
    this.router.navigate(['/pm/sprints/current']);
  }

  updateSprintProgress(): void {
    if (this.debugMode) console.log('🔧 Updating sprint progress');
    // Implementation for updating sprint progress
  }

  // Team methods
  viewTeamDetails(): void {
    this.router.navigate(['/pm/team']);
  }

  generateTeamReport(): void {
    this.router.navigate(['/pm/reports/team']);
  }

  // Performance tracking methods
  getActivityTypeColor(type: string): string {
    const colors = {
      completed: '#52c41a',
      milestone: '#1890ff',
      started: '#722ed1',
      delayed: '#faad14',
    };
    return colors[type as keyof typeof colors] || '#d9d9d9';
  }

  getActivityTypeIcon(type: string): string {
    const icons = {
      completed: 'check-circle',
      milestone: 'flag',
      started: 'play-circle',
      delayed: 'clock-circle',
    };
    return icons[type as keyof typeof icons] || 'info-circle';
  }

  // Utility methods
  calculateEfficiency(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getEfficiencyColor(efficiency: number): string {
    if (efficiency >= 90) return '#52c41a';
    if (efficiency >= 75) return '#faad14';
    return '#f5222d';
  }

  getProductivityTrend(): string {
    const productivity = this.teamProductivity;
    if (productivity >= 85) return 'up';
    if (productivity >= 70) return 'neutral';
    return 'down';
  }

  getDeliveryTrend(): string {
    const delivery = this.onTimeDelivery;
    if (delivery >= 90) return 'up';
    if (delivery >= 80) return 'neutral';
    return 'down';
  }

  // Format methods
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatTrendPercentage(current: number, previous: number): string {
    const change = ((current - previous) / previous) * 100;
    return `${Math.abs(change).toFixed(1)}%`;
  }

  // Refresh methods
  refreshDashboard(): void {
    if (this.debugMode) console.log('🔧 Refreshing PM dashboard');

    if (!this.debugMode) {
      this.fetchDashboardData();
    } else {
      this.loadMockData();
    }
  }
}
