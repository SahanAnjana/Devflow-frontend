import { Component } from '@angular/core';

@Component({
  selector: 'app-pm-dashboard',
  templateUrl: './pm-dashboard.component.html',
  styleUrls: ['./pm-dashboard.component.sass'],
})
export class PmDashboardComponent {
  chartDataSets = [
    [100, 120, 110, 140, 160, 180, 200], // Total Users
    [450, 500, 510, 530, 550, 560, 5678], // Total Orders
    [10000, 11000, 10500, 12000, 12345], // Revenue
    [15, 16, 17, 19, 18.2], // Growth Rate
  ];

  ngOnInit(): void {}
}
