import { Component } from '@angular/core';
import { InterviewService } from 'src/app/_services/hr-services/interview.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.sass'],
})
export class InterviewComponent {
  allInterviewData: any = [];
  pageNumber: any = 1;
  pageSize: any = 10;
  totalRecord: any = 100;
  currentPageIndex = 1;

  constructor(
    private interviewService: InterviewService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.getAllInterviews();
  }

  getAllInterviews() {
    const data: any = [];
    data['skip'] = this.pageNumber;
    data['limit'] = this.pageSize;
    data['application_id'] = '';
    data['interviewer_id'] = '';
    data['from_date'] = '';
    data['to_date'] = '';

    this.interviewService.getAllInterviews(data).subscribe((res: any) => {
      this.allInterviewData = res;
    });
  }

  addNewInterview(index: any) {}
  editInterViews(data: any, index: any) {}
  deleteInterview(data: any) {}

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getAllInterviews();
  }
}
