import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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
export class PmDashboardComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {
    if (this.debugMode) console.log('🔧 PM Dashboard ngOnDestroy called');
    this.componentDestroyed = true;
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
