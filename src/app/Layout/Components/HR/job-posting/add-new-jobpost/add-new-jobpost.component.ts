import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthserviceService } from 'src/app/_services/authservice.service';
import { CommonsService } from 'src/app/_services/commons.service';
import { DepartmentService } from 'src/app/_services/hr-services/department.service';
import { EmployeesService } from 'src/app/_services/hr-services/employees.service';
import { JobPostingService } from 'src/app/_services/hr-services/job-posting.service';
import { PositionsService } from 'src/app/_services/hr-services/positions.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-add-new-jobpost',
  templateUrl: './add-new-jobpost.component.html',
  styleUrls: ['./add-new-jobpost.component.sass'],
})
export class AddNewJobpostComponent {
  @Input() data: any;
  @Input() index: any;
  public addEJobPostForm!: FormGroup;

  departments: any = [];
  positions: any = [];
  employees: any;
  currentUser: any;
  userDetails: any;

  constructor(
    private jobpostingService: JobPostingService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private postionService: PositionsService,
    private employeeService: EmployeesService,
    private tokenService: TokenserviceService,
    private commonService: CommonsService,
    private dataService: DataService,
    private notificationService: NzNotificationService,
    private authService: AuthserviceService
  ) {
    this.currentUser = commonService.parseJwt(tokenService.getToken());
    console.log('currentuser', this.currentUser);
  }
  ngOnInit() {
    this.addEJobPostForm = this.fb.group({
      title: [null],
      description: [null],
      requirements: [null],
      position_id: [null],
      department_id: [null],
      salary_min: [null],
      salary_max: [null],
      location: [null],
      employment_type: [null],
      closing_date: [null],
    });
    if (this.index === 'edit') {
      this.addEJobPostForm.patchValue(this.data);
    }
    else{
      this.getJobPostingFDetails();
    }
    this.getAllDepartments();
    this.getAllpostions();
    this.getAllmployees();
    this.getUserDetailsByme();

   
  }

  get title() {
    return this.addEJobPostForm.get('title');
  }
  get description() {
    return this.addEJobPostForm.get('description');
  }
  get requirements() {
    return this.addEJobPostForm.get('requirements');
  }
  get position_id() {
    return this.addEJobPostForm.get('position_id');
  }
  get department_id() {
    return this.addEJobPostForm.get('department_id');
  }
  get salary_min() {
    return this.addEJobPostForm.get('salary_min');
  }
  get salary_max() {
    return this.addEJobPostForm.get('salary_max');
  }
  get location() {
    return this.addEJobPostForm.get('location');
  }
  get employment_type() {
    return this.addEJobPostForm.get('employment_type');
  }
  get closing_date() {
    return this.addEJobPostForm.get('closing_date');
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe((res: any) => {
      if (res) {
        this.departments = res;
      }
    });
  }

  getAllpostions() {
    this.postionService.getAllPositions({}).subscribe((res: any) => {
      if (res) {
        this.positions = res;
      }
    });
  }

  getAllmployees() {
    this.employeeService.getAllEmployees({}).subscribe((res: any) => {
      if (res) {
        this.employees = res;
      }
    });
  }
  disabledPreviousDates = (date: Date): boolean => {
    return date < new Date();
  };
  saveNewjobPosting() {
    if (this.addEJobPostForm.valid) {
      if (this.index === 'create') {
        const formdata: any = {
          title: this.title?.value,
          description: this.description?.value,
          requirements: this.requirements?.value,
          position_id: this.position_id?.value,
          department_id: this.department_id?.value,
          salary_range_min: this.salary_min?.value,
          salary_range_max: this.salary_max?.value,
          location: this.location?.value,
          employment_type: this.employment_type?.value,
          closing_date: this.closing_date?.value,
          created_by: this.dataService.userDetails.id,
        };
        console.log('formdata valid', formdata);
        this.jobpostingService
          .createJobPosting(formdata)
          .subscribe((res: any) => {
            if (res) {
              this.notificationService.create(
                'success',
                'Success',
                'Job Posting Added Successfully',
                { nzStyle: { background: '#00A03E', color: '#fff' } }
              );
              this.modalRef.close();
            }
          });
      }
    } else {
      Object.values(this.addEJobPostForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  getUserDetailsByme() {
    this.authService.getUsersDetialsBy().subscribe((res: any) => {
      this.userDetails = res;
      this.dataService.userDetails = this.userDetails;
      console.log('this.userDetails', this.userDetails);
    });
  }

  getJobPostingFDetails(){
    this.jobpostingService.getJobPostingDetails(this.data.id).subscribe((res: any) => {
      if (res) {
        this.addEJobPostForm.patchValue({
          title: res['title'],
          description: res['description'],
          requirements: res['requirements'],
          position_id: res['position_id'],
          department_id: res['department_id'],
          salary_min: res['salary_range_min'],
          salary_max: res['salary_range_max'],
          location: res['location'],
          employment_type: res['employment_type'],
          closing_date: res['closing_date'],
        })
      }
    }); 
  }
  close() {
    this.modalRef.close();
  }
}
