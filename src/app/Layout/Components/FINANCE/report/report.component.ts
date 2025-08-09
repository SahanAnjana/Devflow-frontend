import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DownloadReportsService } from 'src/app/_services/download-reports.service';
import { ReportService } from 'src/app/_services/finance/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
})
export class ReportComponent {
  allReportSummary: any[] = []; // Initialize as empty array

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  fromDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // First day of current month
  toDate: any = new Date(); // Today's date
  selectedReport: any = 1;
  filepath: any;

  reportForm!: FormGroup;

  reportList: any = [
    {
      id: 1,
      label: 'Financial Summary report',
    },
    {
      id: 2,
      label: 'Profit and Loss Report',
    },
    {
      id: 3,
      label: 'Revenue report',
    },
    {
      id: 4,
      label: 'Expenses Report',
    },
    {
      id: 5,
      label: 'Project Finance Report',
    },
  ];
  constructor(
    private reportService: ReportService,
    private modalService: NzModalService,
    public dataService: DataService,
    private downloadReportsService: DownloadReportsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.reportForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      selectedReport: [null],
    });
    this.getFinancialSummary();
  }

  // Format date to YYYY-MM-DD format for API
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
        }
      } else if (res) {
        // If the response itself is the data, wrap it in an array
        this.allReportSummary = [res];
      } else {
        // Fallback to empty array
        this.allReportSummary = [];
      }

      console.log('Processed Financial Summary:', this.allReportSummary);
      this.filepath = res?.file_path || '';
    });
  }

  getProfitandLossReport() {
    const data: any = [];
    data['from_date'] = this.formatDate(this.fromDate);
    data['to_date'] = this.formatDate(this.toDate);
    this.reportService.getProfitLossReport(data).subscribe((res) => {
      console.log('Profit & Loss API Response:', res);

      // Handle different response formats
      if (res && res['data']) {
        if (Array.isArray(res['data'])) {
          this.allReportSummary = res['data'];
        } else {
          this.allReportSummary = [res['data']];
        }
      } else if (res) {
        this.allReportSummary = [res];
      } else {
        this.allReportSummary = [];
      }

      this.filepath = res?.file_path || '';
    });
  }

  getRevenueReport() {
    const data: any = [];
    data['from_date'] = this.formatDate(this.fromDate);
    data['to_date'] = this.formatDate(this.toDate);
    this.reportService.getRevenueReport(data).subscribe((res) => {
      console.log('Revenue API Response:', res);

      // Handle different response formats
      if (res && res['data']) {
        if (Array.isArray(res['data'])) {
          this.allReportSummary = res['data'];
        } else {
          this.allReportSummary = [res['data']];
        }
      } else if (res) {
        this.allReportSummary = [res];
      } else {
        this.allReportSummary = [];
      }

      this.filepath = res?.file_path || '';
    });
  }

  getExpensiveReport() {
    const data: any = [];
    data['from_date'] = this.formatDate(this.fromDate);
    data['to_date'] = this.formatDate(this.toDate);
    this.reportService.getExpnsiveReport(data).subscribe((res) => {
      console.log('Expenses API Response:', res);

      // Handle different response formats
      if (res && res['data']) {
        if (Array.isArray(res['data'])) {
          this.allReportSummary = res['data'];
        } else {
          this.allReportSummary = [res['data']];
        }
      } else if (res) {
        this.allReportSummary = [res];
      } else {
        this.allReportSummary = [];
      }

      this.filepath = res?.file_path || '';
    });
  }

  getProjectFinanceReport() {
    const data: any = [];
    data['from_date'] = this.formatDate(this.fromDate);
    data['to_date'] = this.formatDate(this.toDate);
    this.reportService.getProjectFInanceReport(data).subscribe((res) => {
      console.log('Project Finance API Response:', res);

      // Handle different response formats
      if (res && res['data']) {
        if (Array.isArray(res['data'])) {
          this.allReportSummary = res['data'];
        } else {
          this.allReportSummary = [res['data']];
        }
      } else if (res) {
        this.allReportSummary = [res];
      } else {
        this.allReportSummary = [];
      }

      this.filepath = res?.file_path || '';
    });
  }
  // }

  onReportChange(event: any) {
    console.log('Selected Report:', event);
    this.selectedReport = event;
    switch (this.selectedReport) {
      case 1:
        this.getFinancialSummary();
        break;
      case 2:
        this.getProfitandLossReport();
        break;
      case 3:
        this.getRevenueReport();
        break;
      case 4:
        this.getExpensiveReport();
        break;
      case 5:
        this.getProjectFinanceReport();
        break;
      default:
        break;
    }
  }

  downloadReport() {
    const data: any = [];
    data['file_path'] = this.filepath; // Example file path, adjust as needed
    this.downloadReportsService.downloadFinancialSummary(data).subscribe(
      (res) => {
        // Handle successful response
      },
      (error) => {
        // Handle error response
      }
    );
  }
}
