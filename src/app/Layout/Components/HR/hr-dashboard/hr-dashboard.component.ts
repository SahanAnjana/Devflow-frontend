import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.sass'],
})
export class HrDashboardComponent {
  // Recent activities data
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

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createDepartmentChart();
  }

  createDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    const departmentChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
        datasets: [
          {
            data: [45, 25, 20, 10, 15],
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
}
