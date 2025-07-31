import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DownloadReportsService } from 'src/app/_services/download-reports.service';
import { ReportService } from 'src/app/_services/finance/report.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass'],
})
export class ReportsComponent {
  allReportSummary: any;

  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any;
  currentPageIndex = 1;

  fromDate: any;
  toDate: any;
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

  // Date validation methods
  disabledFromDate = (current: Date): boolean => {
    // Disable future dates from today and dates after the selected toDate
    if (!this.toDate) {
      return current && current > new Date();
    }
    return current && (current > this.toDate || current > new Date());
  };

  disabledToDate = (current: Date): boolean => {
    // Disable dates before the selected fromDate and future dates
    if (!this.fromDate) {
      return current && current > new Date();
    }
    return current && (current < this.fromDate || current > new Date());
  };

  onFromDateChange(date: Date): void {
    this.fromDate = date;
    // Clear toDate if it's before the new fromDate
    if (this.toDate && this.toDate < this.fromDate) {
      this.toDate = null;
      this.reportForm.patchValue({ toDate: null });
    }
  }

  onToDateChange(date: Date): void {
    this.toDate = date;
    // Clear fromDate if it's after the new toDate
    if (this.fromDate && this.fromDate > this.toDate) {
      this.fromDate = null;
      this.reportForm.patchValue({ fromDate: null });
    }
  }

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

  getFinancialSummary() {
    const data: any = [];
    data['from_date'] = this.fromDate;
    data['to_date'] = this.toDate;
    this.reportService.getFinancialSummary(data).subscribe((res) => {
      this.allReportSummary = res;
      this.filepath = res.file_path;
    });
  }

  getProfitandLossReport() {
    const data: any = [];
    data['from_date'] = this.fromDate;
    data['to_date'] = this.toDate;
    this.reportService.getProfitLossReport(data).subscribe((res) => {
      this.allReportSummary = res;
      this.filepath = res.file_path;
    });
  }

  getRevenueReport() {
    const data: any = [];
    data['from_date'] = this.fromDate;
    data['to_date'] = this.toDate;
    this.reportService.getRevenueReport(data).subscribe((res) => {
      this.allReportSummary = res;
      this.filepath = res.file_path;
    });
  }
  getExpensiveReport() {
    const data: any = [];
    data['from_date'] = this.fromDate;
    data['to_date'] = this.toDate;
    this.reportService.getExpnsiveReport(data).subscribe((res) => {
      this.allReportSummary = res;
      this.filepath = res.file_path;
    });
  }
  getProjectFinanceReport() {
    const data: any = [];
    data['from_date'] = this.fromDate;
    data['to_date'] = this.toDate;
    this.reportService.getProjectFInanceReport(data).subscribe((res) => {
      this.allReportSummary = res;
      this.filepath = res.file_path;
    });
  }

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
