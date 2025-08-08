import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

interface CRMDashboardData {
  total_pending_activities: number;
  each_status_activity: {
    pending: number;
    completed: number;
    cancelled: number;
  };
  each_type_activity: {
    call: number;
    email: number;
    meeting: number;
    task: number;
    note: number;
  };
  total_communications: number;
  each_direction_communication: {
    inbound: number;
    outbound: number;
  };
  each_type_communication: {
    email: number;
    call: number;
    meeting: number;
    sms: number;
    chat: number;
    social: number;
    other: number;
  };
  total_companies: number;
  each_company_stats: Record<
    string,
    {
      contacts: number;
      deals: number;
      contracts: number;
    }
  >;
  total_contacts: number;
  each_tag_contacts: Record<string, number>;
  total_contracts: number;
  each_status_contracts: {
    draft: number;
    sent: number;
    signed: number;
    active: number;
    expired: number;
    terminated: number;
  };
  total_proposals: number;
  each_status_proposals: {
    draft: number;
    sent: number;
    under_review: number;
    accepted: number;
    rejected: number;
    expired: number;
  };
  total_deals: number;
  each_stage_deals: {
    prospecting: number;
    qualified: number;
    proposal_sent: number;
    negotiation: number;
    won: number;
    lost: number;
  };
}

@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.sass'],
})
export class CrmDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Debug mode flag
  debugMode = true;

  // API data
  dashboardData: CRMDashboardData | null = null;
  isLoading = false;
  error: string | null = null;

  // Chart tracking
  private chartsCreated = false;
  private componentDestroyed = false;
  private activityChart: Chart | null = null;
  private communicationChart: Chart | null = null;
  private contractChart: Chart | null = null;

  // Computed properties for easy access
  get totalPendingActivities(): number {
    return this.dashboardData?.total_pending_activities ?? 0;
  }

  get totalCommunications(): number {
    return this.dashboardData?.total_communications ?? 0;
  }

  get totalCompanies(): number {
    return this.dashboardData?.total_companies ?? 0;
  }

  get totalContacts(): number {
    return this.dashboardData?.total_contacts ?? 0;
  }

  get totalContracts(): number {
    return this.dashboardData?.total_contracts ?? 0;
  }

  get totalProposals(): number {
    return this.dashboardData?.total_proposals ?? 0;
  }

  get totalDeals(): number {
    return this.dashboardData?.total_deals ?? 0;
  }

  get activityStatusData(): any {
    return this.dashboardData?.each_status_activity || {};
  }

  get communicationDirectionData(): any {
    return this.dashboardData?.each_direction_communication || {};
  }

  get contractStatusData(): any {
    return this.dashboardData?.each_status_contracts || {};
  }

  get dealStageData(): any {
    return this.dashboardData?.each_stage_deals || {};
  }

  // Recent activities data
  recentActivities = [
    {
      color: '#52c41a',
      title: 'New employee John Doe joined',
      time: '2 hours ago',
    },
    {
      color: '#1890ff',
      title: 'Performance review completed',
      time: '4 hours ago',
    },
    {
      color: '#faad14',
      title: 'Leave request from Jane Smith',
      time: '6 hours ago',
    },
    {
      color: '#722ed1',
      title: 'Team meeting scheduled',
      time: '1 day ago',
    },
  ];

  // Upcoming reviews data
  upcomingReviews = [
    {
      employeeName: 'John Doe',
      employeeInitials: 'JD',
      department: 'Engineering',
      date: '2025-07-25',
      status: 'Scheduled',
      statusColor: 'blue',
    },
    {
      employeeName: 'Jane Smith',
      employeeInitials: 'JS',
      department: 'Marketing',
      date: '2025-07-28',
      status: 'Pending',
      statusColor: 'orange',
    },
    {
      employeeName: 'Mike Johnson',
      employeeInitials: 'MJ',
      department: 'Sales',
      date: '2025-07-30',
      status: 'Confirmed',
      statusColor: 'green',
    },
  ];

  constructor(private http: HttpClient) {
    if (this.debugMode) console.log('🔧 CRM Dashboard constructor called');
  }

  ngOnInit(): void {
    if (this.debugMode) console.log('🔧 CRM Dashboard ngOnInit called');

    try {
      this.initializeDefaults();

      if (!this.debugMode) {
        this.fetchDashboardData();
      } else {
        console.log('🔧 Debug mode: Loading mock CRM data');
        this.loadMockData();
      }
    } catch (error) {
      console.error('❌ Error in CRM ngOnInit:', error);
      this.error = 'Error initializing CRM Dashboard';
    }
  }

  ngAfterViewInit(): void {
    if (this.debugMode) console.log('🔧 CRM Dashboard ngAfterViewInit called');

    try {
      // Create charts immediately if data is available (no setTimeout)
      if (
        !this.debugMode &&
        this.dashboardData &&
        !this.chartsCreated &&
        !this.componentDestroyed
      ) {
        this.createAllCharts();
      } else {
        console.log('🔧 Debug mode: Skipping chart creation');
      }
    } catch (error) {
      console.error('❌ Error in CRM ngAfterViewInit:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.debugMode) console.log('🔧 CRM Dashboard ngOnDestroy called');
    this.componentDestroyed = true;
    this.destroyCharts();
  }

  private initializeDefaults(): void {
    if (this.debugMode) console.log('🔧 Initializing CRM defaults');

    // Set safe default values
    this.dashboardData = {
      total_pending_activities: 0,
      total_communications: 0,
      total_companies: 0,
      total_contacts: 0,
      total_contracts: 0,
      total_proposals: 0,
      total_deals: 0,
      each_status_activity: { pending: 0, completed: 0, cancelled: 0 },
      each_type_activity: { call: 0, email: 0, meeting: 0, task: 0, note: 0 },
      each_direction_communication: { inbound: 0, outbound: 0 },
      each_type_communication: {
        email: 0,
        call: 0,
        meeting: 0,
        sms: 0,
        chat: 0,
        social: 0,
        other: 0,
      },
      each_company_stats: {},
      each_tag_contacts: {},
      each_status_contracts: {
        draft: 0,
        sent: 0,
        signed: 0,
        active: 0,
        expired: 0,
        terminated: 0,
      },
      each_status_proposals: {
        draft: 0,
        sent: 0,
        under_review: 0,
        accepted: 0,
        rejected: 0,
        expired: 0,
      },
      each_stage_deals: {
        prospecting: 0,
        qualified: 0,
        proposal_sent: 0,
        negotiation: 0,
        won: 0,
        lost: 0,
      },
    };
  }

  private loadMockData(): void {
    if (this.debugMode) console.log('🔧 Loading mock CRM data');

    this.dashboardData = {
      total_pending_activities: 2,
      total_communications: 17,
      total_companies: 6,
      total_contacts: 9,
      total_contracts: 16,
      total_proposals: 11,
      total_deals: 8,
      each_status_activity: { pending: 2, completed: 5, cancelled: 5 },
      each_type_activity: { call: 2, email: 2, meeting: 1, task: 3, note: 4 },
      each_direction_communication: { inbound: 7, outbound: 10 },
      each_type_communication: {
        email: 1,
        call: 2,
        meeting: 3,
        sms: 0,
        chat: 5,
        social: 0,
        other: 6,
      },
      each_company_stats: {},
      each_tag_contacts: {},
      each_status_contracts: {
        draft: 0,
        sent: 0,
        signed: 0,
        active: 10,
        expired: 3,
        terminated: 3,
      },
      each_status_proposals: {
        draft: 11,
        sent: 0,
        under_review: 0,
        accepted: 0,
        rejected: 0,
        expired: 0,
      },
      each_stage_deals: {
        prospecting: 1,
        qualified: 0,
        proposal_sent: 0,
        negotiation: 1,
        won: 0,
        lost: 0,
      },
    };

    console.log('✅ Mock CRM data loaded');
  }

  fetchDashboardData(): void {
    if (this.debugMode) console.log('🔧 Fetching CRM dashboard data...');

    this.isLoading = true;
    this.error = null;

    this.http
      .get<CRMDashboardData>('http://140.245.213.62:8004/dashboard/')
      .subscribe({
        next: (data) => {
          if (this.debugMode) console.log('✅ CRM Data received:', data);
          this.dashboardData = data;
          this.isLoading = false;

          // Create charts immediately after data is loaded (REMOVED setTimeout)
          if (!this.chartsCreated && !this.componentDestroyed) {
            this.createAllCharts();
          }
        },
        error: (error) => {
          console.error('❌ CRM API Error:', error);
          this.isLoading = false;
          this.error = `CRM API Error: ${error.status} - ${error.message}`;

          // Load mock data as fallback
          this.loadMockData();
        },
      });
  }

  private createAllCharts(): void {
    if (this.chartsCreated || this.componentDestroyed || !this.dashboardData) {
      return;
    }

    try {
      if (this.debugMode) console.log('🔧 Creating CRM charts...');

      this.destroyCharts(); // Clean up any existing charts

      this.createActivityChart();
      this.createCommunicationChart();
      this.createContractChart();

      this.chartsCreated = true;
      console.log('✅ All CRM charts created successfully');
    } catch (error) {
      console.error('❌ Error creating charts:', error);
      this.chartsCreated = false;
    }
  }

  private destroyCharts(): void {
    try {
      if (this.activityChart) {
        this.activityChart.destroy();
        this.activityChart = null;
      }
      if (this.communicationChart) {
        this.communicationChart.destroy();
        this.communicationChart = null;
      }
      if (this.contractChart) {
        this.contractChart.destroy();
        this.contractChart = null;
      }
    } catch (error) {
      console.error('❌ Error destroying charts:', error);
    }
  }

  createActivityChart(): void {
    const ctx = document.getElementById('activityChart') as HTMLCanvasElement;
    if (ctx && this.dashboardData && !this.componentDestroyed) {
      try {
        const activityData = this.dashboardData.each_status_activity;
        this.activityChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Pending', 'Completed', 'Cancelled'],
            datasets: [
              {
                data: [
                  activityData.pending,
                  activityData.completed,
                  activityData.cancelled,
                ],
                backgroundColor: ['#faad14', '#52c41a', '#f5222d'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right' },
              title: { display: true, text: 'Activity Status Distribution' },
            },
          },
        });
      } catch (error) {
        console.error('❌ Error creating activity chart:', error);
      }
    }
  }

  createCommunicationChart(): void {
    const ctx = document.getElementById(
      'communicationChart'
    ) as HTMLCanvasElement;
    if (ctx && this.dashboardData && !this.componentDestroyed) {
      try {
        const commData = this.dashboardData.each_direction_communication;
        this.communicationChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Inbound', 'Outbound'],
            datasets: [
              {
                label: 'Communications',
                data: [commData.inbound, commData.outbound],
                backgroundColor: ['#1890ff', '#722ed1'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Communication Direction' },
            },
          },
        });
      } catch (error) {
        console.error('❌ Error creating communication chart:', error);
      }
    }
  }

  createContractChart(): void {
    const ctx = document.getElementById('contractChart') as HTMLCanvasElement;
    if (ctx && this.dashboardData && !this.componentDestroyed) {
      try {
        const contractData = this.dashboardData.each_status_contracts;
        this.contractChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [
              'Active',
              'Expired',
              'Terminated',
              'Draft',
              'Sent',
              'Signed',
            ],
            datasets: [
              {
                data: [
                  contractData.active,
                  contractData.expired,
                  contractData.terminated,
                  contractData.draft,
                  contractData.sent,
                  contractData.signed,
                ],
                backgroundColor: [
                  '#52c41a',
                  '#faad14',
                  '#f5222d',
                  '#d9d9d9',
                  '#1890ff',
                  '#722ed1',
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right' },
              title: { display: true, text: 'Contract Status Distribution' },
            },
          },
        });
      } catch (error) {
        console.error('❌ Error creating contract chart:', error);
      }
    }
  }

  // Navigation methods
  navigateToActivities(): void {
    // Implementation for navigation to activities
  }

  navigateToCommunications(): void {
    // Implementation for navigation to communications
  }

  navigateToCompanies(): void {
    // Implementation for navigation to companies
  }

  navigateToContacts(): void {
    // Implementation for navigation to contacts
  }

  navigateToContracts(): void {
    // Implementation for navigation to contracts
  }

  navigateToProposals(): void {
    // Implementation for navigation to proposals
  }

  navigateToDeals(): void {
    // Implementation for navigation to deals
  }

  getDealStages(): { name: string; count: number }[] {
    if (!this.dashboardData) return [];

    try {
      const stages = this.dashboardData.each_stage_deals;
      return [
        { name: 'Prospecting', count: stages.prospecting },
        { name: 'Qualified', count: stages.qualified },
        { name: 'Proposal Sent', count: stages.proposal_sent },
        { name: 'Negotiation', count: stages.negotiation },
        { name: 'Won', count: stages.won },
        { name: 'Lost', count: stages.lost },
      ];
    } catch (error) {
      console.error('❌ Error processing deal stages:', error);
      return [];
    }
  }
}
