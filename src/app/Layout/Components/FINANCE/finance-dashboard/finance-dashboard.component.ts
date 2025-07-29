import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportService } from 'src/app/_services/finance/report.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.sass'],
})
export class FinanceDashboardComponent {
  fromDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // First day of current month
  toDate: any = new Date(); // Today's date
  selectedReport: any = 1;
  filepath: any;

  allReportSummary: any[] = []; // Initialize as empty array

  // Separated financial data arrays
  financialLabels: string[] = [];
  financialValues: number[] = [];

  recentActivities = [
    {
      icon: 'user-add',
      color: '#52c41a',
      title: 'New employee John Doe joined',
      time: '2 hours ago',
    },
    {
      icon: 'solution',
      color: '#1890ff',
      title: 'Performance review completed',
      time: '4 hours ago',
    },
    {
      icon: 'schedule',
      color: '#faad14',
      title: 'Leave request from Jane Smith',
      time: '6 hours ago',
    },
    {
      icon: 'team',
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

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Load financial data when component initializes
    this.getFinancialSummary();
  }

  ngAfterViewInit(): void {
    this.createDepartmentChart();
    // Note: Financial chart will be created after data is loaded in getFinancialSummary()
  }

  createDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    const departmentChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.financialLabels,
        datasets: [
          {
            data: this.financialValues,
            backgroundColor: [
              '#1890ff',
              '#52c41a',
              '#faad14',
              '#722ed1',
              '#f5222d',
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Employee Distribution by Department',
          },
        },
      },
    });
  }
  formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFinancialSummary() {
    const data: any = [];
    data['from_date'] = this.formatDate(this.fromDate);
    data['to_date'] = this.formatDate(this.toDate);
    this.reportService.getFinancialSummary(data).subscribe((res) => {
      console.log('API Response:', res);

      // Handle different response formats
      if (res && res['data']) {
        // If data is an array, use it directly
        if (Array.isArray(res['data'])) {
          this.allReportSummary = res['data'];
        } else {
          // If data is an object, wrap it in an array for the table
          this.allReportSummary = [res['data']];

          // Extract financial data and separate into labels and values
          this.extractFinancialData(res['data']);
        }
      } else if (res) {
        // If the response itself is the data, wrap it in an array
        this.allReportSummary = [res];
        this.extractFinancialData(res);
      } else {
        // Fallback to empty array
        this.allReportSummary = [];
      }

      console.log('Processed Financial Summary:', this.allReportSummary);
      this.filepath = res?.file_path || '';
    });
  }

  // Extract and separate financial data into labels and values arrays
  extractFinancialData(data: any) {
    // Get raw arrays (exactly as you requested)
    const rawArrays = this.getRawFinancialArrays(data);

    // Define which fields to extract (excluding date fields)
    const financialFields = [
      'total_income',
      'total_expenses',
      'net_profit',
      'pending_invoices',
      'overdue_invoices',
    ];

    // Extract labels (property names) - formatted for display
    this.financialLabels = financialFields.map((field) => {
      // Convert snake_case to Title Case for better display
      return field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    });

    // Extract values
    this.financialValues = financialFields.map((field) => data[field] || 0);

    console.log('Formatted Labels:', this.financialLabels);
    console.log('Formatted Values:', this.financialValues);

    // Create different charts using the separated arrays
    this.createFinancialChart(this.financialLabels, this.financialValues);

    // Optionally create additional chart types
    // this.createFinancialDoughnutChart(this.financialLabels, this.financialValues);
    // this.createFinancialLineChart(this.financialLabels, this.financialValues);

    return {
      labels: this.financialLabels,
      values: this.financialValues,
      rawLabels: rawArrays.labels,
      rawValues: rawArrays.values,
    };
  }

  // Get raw financial data arrays (snake_case labels and raw values)
  getRawFinancialArrays(data: any) {
    const financialFields = [
      'total_income',
      'total_expenses',
      'net_profit',
      'pending_invoices',
      'overdue_invoices',
    ];

    // Raw labels array (exactly as requested)
    const rawLabels = financialFields;

    // Raw values array (exactly as requested)
    const rawValues = financialFields.map((field) => data[field] || 0);

    console.log('Raw Labels Array:', rawLabels);
    console.log('Raw Values Array:', rawValues);

    return {
      labels: rawLabels, // ['total_income', 'total_expenses', 'net_profit', 'pending_invoices', 'overdue_invoices']
      values: rawValues, // [0.0, 0.0, 0.0, 539521.5512695312, 0.0]
    };
  }

  // Create a chart with the financial data
  createFinancialChart(labels: string[], values: number[]) {
    const ctx = document.getElementById('financialChart') as HTMLCanvasElement;

    if (ctx) {
      // Destroy existing chart if it exists
      if (Chart.getChart(ctx)) {
        Chart.getChart(ctx)?.destroy();
      }

      const financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Amount ($)',
              data: values,
              backgroundColor: [
                '#52c41a', // Total Income - Green
                '#f5222d', // Total Expenses - Red
                '#1890ff', // Net Profit - Blue
                '#faad14', // Pending Invoices - Orange
                '#722ed1', // Overdue Invoices - Purple
              ],
              borderColor: [
                '#52c41a',
                '#f5222d',
                '#1890ff',
                '#faad14',
                '#722ed1',
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Financial Summary',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + Number(value).toLocaleString();
                },
              },
            },
          },
        },
      });

      console.log('Financial chart created with data:', {
        labels: labels,
        values: values,
      });
    } else {
      console.warn('financialChart canvas element not found');
    }
  }

  // Create a doughnut chart using the financial arrays
  createFinancialDoughnutChart(labels: string[], values: number[]) {
    const ctx = document.getElementById(
      'financialDoughnutChart'
    ) as HTMLCanvasElement;

    if (ctx) {
      // Destroy existing chart if it exists
      if (Chart.getChart(ctx)) {
        Chart.getChart(ctx)?.destroy();
      }

      const doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                '#52c41a', // Total Income - Green
                '#f5222d', // Total Expenses - Red
                '#1890ff', // Net Profit - Blue
                '#faad14', // Pending Invoices - Orange
                '#722ed1', // Overdue Invoices - Purple
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Financial Distribution',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
        },
      });
    }
  }

  // Create a line chart for trends (if you have time-series data)
  createFinancialLineChart(labels: string[], values: number[]) {
    const ctx = document.getElementById(
      'financialLineChart'
    ) as HTMLCanvasElement;

    if (ctx) {
      // Destroy existing chart if it exists
      if (Chart.getChart(ctx)) {
        Chart.getChart(ctx)?.destroy();
      }

      const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Financial Metrics',
              data: values,
              borderColor: '#1890ff',
              backgroundColor: 'rgba(24, 144, 255, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Financial Trends',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + Number(value).toLocaleString();
                },
              },
            },
          },
        },
      });
    }
  }

  // Utility method to get specific financial metric
  getFinancialMetric(metricName: string): number {
    const index = this.financialLabels.findIndex((label) =>
      label.toLowerCase().includes(metricName.toLowerCase())
    );
    return index !== -1 ? this.financialValues[index] : 0;
  }

  // Utility method to get the highest value metric
  getHighestMetric(): { label: string; value: number } {
    if (this.financialValues.length === 0) return { label: '', value: 0 };

    const maxValue = Math.max(...this.financialValues);
    const maxIndex = this.financialValues.indexOf(maxValue);

    return {
      label: this.financialLabels[maxIndex],
      value: maxValue,
    };
  }

  // Utility method to filter out zero values for cleaner charts
  getFilteredArrays(): { labels: string[]; values: number[] } {
    const filtered = this.financialLabels
      .map((label, index) => ({ label, value: this.financialValues[index] }))
      .filter((item) => item.value !== 0);

    return {
      labels: filtered.map((item) => item.label),
      values: filtered.map((item) => item.value),
    };
  }

  // Method to refresh charts with current data
  refreshCharts() {
    if (this.financialLabels.length > 0 && this.financialValues.length > 0) {
      // Get filtered data (removing zero values)
      const filtered = this.getFilteredArrays();

      // Recreate charts with filtered data for better visualization
      this.createFinancialChart(filtered.labels, filtered.values);
    }
  }
}
