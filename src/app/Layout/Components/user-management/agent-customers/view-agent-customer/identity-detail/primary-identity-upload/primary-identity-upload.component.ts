import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonsService } from 'src/app/_services/commons.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { MetaService } from 'src/app/_services/meta.service';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';

@Component({
  selector: 'app-primary-identity-upload',
  templateUrl: './primary-identity-upload.component.html',
  styleUrls: ['./primary-identity-upload.component.sass'],
})
export class PrimaryIdentityUploadComponent {
  primaryIdentityUploadForm!: FormGroup;
  primaryIdentityForm!: FormGroup;
  receivedCustomerData: any;
  agentExposableId: any;
  agentSenderDetailsId: any;
  userId: any;
  emailAddress: any;
  dateOfBirth: any;
  birthPlace: any;
  clientData: any;
  identityTypes: any[] = [];

  frontFileList: any[] = [];
  backFileList: any[] = [];
  frontAvatarUrl!: string;
  backAvatarUrl!: string;
  frontLoading = false;
  backLoading = false;
  frontUploaded = false;
  backUploaded = false;

  previewModalVisible = false;
  viewFront = false;
  viewBack = false;
  showBackImgUpload = true;
  customerData: any[] = [];
  customerImageData: any;

  uploadedImages = [];
  selectedFrontImgUrl!: string;
  selectedBackImgUrl!: string;
  viewSelectedFrontImg = false;
  viewSelectedBackImg = false;

  todayDate = new Date();

  currentPageIndex: any = 1;
  pageNumber: any = 1;
  pageSize = 5;
  totalRecord = 0;
  /////////////temporary services
  agentIdentityModeDataService: any;
  amlcoreCustomerDataService: any;
  amlcoreSearchDataService: any;
  constructor(
    private commonsService: CommonsService,
    private notificationService: NzNotificationService,
    private formBuilder: FormBuilder,
    // private identityModeDataService: IdentityModeDataService,
    // private agentIdentityModeDataService: AgentIdentityModeDataService,
    private agentCustomerService: AgentCustomerService,
    private modalRef: NzModalRef,
    private metaService: MetaService,
    private dataService: DataService // private amlcoreCustomerDataService: AmlCustomerDataService, // private amlcoreSearchDataService: AmlSearchDataService, // private amlCustomerImageDataService: AmlCustomerImageDataService, // private creditSafeCustomerDetailsDataService: CreditSafeAmlDataService, // private agentTransactionIdentityDataService : AgentTransactionIdentityDataService
  ) {
    // this.clientData = this.commonsService.parseJwt(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.primaryIdentityUploadForm = this.formBuilder.group({
      identityType: [null],
    });

    this.primaryIdentityForm = this.formBuilder.group({
      identityTypeDetails: [null, Validators.required],
      identityNumber: [null, Validators.required],
      issueDate: [null, Validators.required],
      expiryDate: [null, Validators.required],
      amlCheckStatus: [null, Validators.required],
    });
    console.log('-----------1--------------', this.dataService.selectedData);
    this.getExposableId();
    this.getSelectedCustomerData();
    this.getCustomerDetails();
    this.identityType?.disable();
  }

  getExposableId() {
    this.metaService
      .getAgentDetailsGetExposableId(this.dataService.selectedData.email)
      .subscribe({
        next: (res: any) => {
          if (res['responseDto']) {
            let agentExposableId = res['responseDto'].agentExposableId;
            this.getIdentityTypes(agentExposableId);
          }
        },
      });
  }
  dateFormatter(date: string) {
    return format(new Date(date), 'yyyy-MM-dd');
  }

  get identityType() {
    return this.primaryIdentityUploadForm.get('identityType');
  }

  get identityTypeDetails() {
    return this.primaryIdentityForm.get('identityTypeDetails');
  }

  get identityNumber() {
    return this.primaryIdentityForm.get('identityNumber');
  }

  get issueDate() {
    return this.primaryIdentityForm.get('issueDate');
  }

  get expiryDate() {
    return this.primaryIdentityForm.get('expiryDate');
  }

  get amlCheckStatus() {
    return this.primaryIdentityForm.get('amlCheckStatus');
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'identityType': {
        return 'Identity Type';
      }
      case 'identityTypeDetails': {
        return 'Identity Type';
      }
      case 'identityNumber': {
        return 'Identity Number';
      }
      case 'issueDate': {
        return 'Issue Date';
      }
      case 'expiryDate': {
        return 'Expiry Date';
      }
      case 'amlCheckStatus': {
        return 'AML Check Status';
      }
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (!control.value && control.errors) {
          control.markAsDirty();
          control.updateValueAndValidity();
          const fieldName = this.getFieldName(field);
          this.notificationService.create(
            'error',
            'Input Error',
            fieldName + ' cannot be empty',
            { nzStyle: { background: '#cc2d2d', color: '#fff' } }
          );
        } else {
          // this.isFieldValid(field);
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getSelectedCustomerData() {
    this.receivedCustomerData = this.dataService.selectedData;
    if (this.receivedCustomerData) {
      this.primaryIdentityForm.patchValue({
        amlCheckStatus: this.receivedCustomerData.idScanStatus,
        expiryDate:
          this.receivedCustomerData?.agentTransactionSenderIdentityValuesDto
            ?.expiraryDate,
        identityNumber:
          this.receivedCustomerData?.agentTransactionSenderIdentityValuesDto
            ?.identityModeValue,
        issueDate:
          this.receivedCustomerData?.agentTransactionSenderIdentityValuesDto
            ?.issueDate,
        identityTypeDetails: this.receivedCustomerData.identityModeId,
      });
      this.primaryIdentityUploadForm.patchValue({
        identityType: this.receivedCustomerData.identityModeId,
      });
      this.hideBackImgUpload();
    }
  }

  getIdentityTypes(data: any) {
    this.metaService.getagentIdentityMode(data).subscribe((res: any) => {
      this.identityTypes = res['responseDto'];
    });
  }

  update() {
    // tslint:disable-next-line: max-line-length
    if (
      !(this.frontFileList.length > 0) ||
      (this.showBackImgUpload && !(this.backFileList.length > 0))
    ) {
      if (this.frontFileList.length === 0) {
        this.notificationService.create(
          'error',
          'Input Error',
          'Front Image cannot be empty',
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      }
      if (this.showBackImgUpload && this.backFileList.length === 0) {
        this.notificationService.create(
          'error',
          'Input Error',
          'Back Image cannot be empty',
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      }

      return;
    } else {
      //this.handleFrontUpload();
      this.uploadPrimaryImage();
    }
  }

  private getBase64(img: NzUploadFile, callback: (img: string) => void): void {
    const reader = new FileReader();
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    // @ts-ignore
    reader.readAsDataURL(img);
  }

  beforeFrontUpload = (file: NzUploadFile): boolean => {
    this.getBase64(file, (img: string) => {
      this.frontLoading = false;
      this.frontAvatarUrl = img;
    });

    this.frontFileList = this.frontFileList.concat(file);
    this.frontUploaded = true;

    return false;
  };

  beforeBackUpload = (file: NzUploadFile): boolean => {
    this.getBase64(file, (img: string) => {
      this.backLoading = false;
      this.backAvatarUrl = img;
    });

    this.backFileList = this.backFileList.concat(file);
    this.backUploaded = true;

    return false;
  };

  removeFrontData = (file: NzUploadFile): boolean => {
    this.frontAvatarUrl = '';
    return true;
  };

  removeBackData = (file: NzUploadFile): boolean => {
    this.backAvatarUrl = '';
    return true;
  };

  handleCancel(): void {
    this.previewModalVisible = false;
    this.viewFront = false;
    this.viewBack = false;
  }

  viewFrontIdPreview() {
    this.viewFront = true;
    this.previewModalVisible = true;
    this.viewBack = false;
  }

  viewBackIdPreview() {
    this.viewBack = true;
    this.previewModalVisible = true;
    this.viewFront = false;
  }

  hideBackImgUpload() {
    if (this.identityType!.value && this.identityType!.value == 1) {
      this.showBackImgUpload = false;
      this.backAvatarUrl = '';
      this.backFileList = [];
    } else {
      this.showBackImgUpload = true;
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }

  handleOk() {}
  uploadPrimaryImage() {
    if (!this.primaryIdentityForm.valid) {
      this.validateAllFormFields(this.primaryIdentityForm);
    } else {
      if (this.dataService.selectedData.customerDetailsId === null) {
        this.notificationService.create(
          'error',
          'Error',
          'User not properly SignUp to the System',
          { nzStyle: { background: '#cc2d2d', color: '#fff' } }
        );
      } else {
        const data: any = {
          primaryId: this.identityTypeDetails?.value,
        };
        let formData = new FormData();
        this.frontFileList[0] &&
          formData.append('frontImage', this.frontFileList[0]);
        this.identityType?.value === 1 &&
          formData.append('backImage', this.frontFileList[0]);
        this.backFileList[0] &&
          formData.append('backImage', this.backFileList[0]);

        this.agentCustomerService
          .customerImageDetailsPrimaryUpload(
            formData,
            data,
            this.dataService.selectedData.customerDetailsId
          )
          .subscribe({
            next: (res: any) => {
              if (res['responseDto']) {
                this.notificationService.create(
                  'success',
                  'Success',
                  res['responseDto'],
                  { nzStyle: { background: '#00A03E', color: '#fff' } }
                );
                this.clear();
                this.getCustomerDetails();
              } else {
                this.notificationService.create(
                  'error',
                  'Error',
                  'Image Upload Failed',
                  { nzStyle: { background: '#cc2d2d', color: '#fff' } }
                );
              }
            },
          });
      }
    }
  }
  clear() {
    // this.primaryIdentityUploadForm.reset();
    this.frontAvatarUrl = '';
    this.frontFileList = [];
    this.backAvatarUrl = '';
    this.backFileList = [];
  }

  getCustomerDetails() {
    const data: any = {};
    data['customerDetailsId'] = this.dataService.selectedData.customerDetailsId;
    data['pageSize'] = this.pageSize;
    data['pageNumber'] = this.pageNumber;

    this.agentCustomerService
      .getAllretrieveAllPrimaryids(data)
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.customerData = res['responseDto']['payload'];
          this.totalRecord = res['responseDto']['totalRecords'];
        } else {
          this.customerData = [];
          this.totalRecord = 0;
        }
      });
  }
  getCustomerImageDetails(receivedData: any) {
    const data = {
      customerDetailsId: receivedData,
      identityModeId: receivedData,
    };
    this.agentCustomerService.getCustomerImageDetails(data).subscribe({
      next: (res: any) => {},
    });
  }

  viewImage(receivedData: any) {
    if (receivedData.frontImgUrl !== undefined) {
      this.selectedFrontImgUrl =
        'data:image/jpeg;base64,' + receivedData.frontImgUrl;
      this.viewSelectedFrontImg = true;
    }

    if (receivedData.backImgUrl !== undefined) {
      this.selectedBackImgUrl =
        'data:image/jpeg;base64,' + receivedData.backImgUrl;
      this.viewSelectedBackImg = true;
    }

    this.previewModalVisible = true;
  }

  disabledPastDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) < 0;
  };

  disabledFutureDates = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };

  updateIdDetails() {
    if (!this.primaryIdentityForm.valid) {
      this.validateAllFormFields(this.primaryIdentityForm);
      return;
    } else {
      let data = {
        identityModeValue: this.identityNumber!.value,
        expiraryDate: this.expiryDate!.value,
        issueDate: this.issueDate!.value,
        agentIdentityModeId: this.identityTypeDetails!.value,
        agentSenderDetailsDto: {
          agentSenderDetailsId: this.receivedCustomerData.agentSenderDetailsId,
        },
        amlStatus: this.amlCheckStatus?.value,
      };

      this.agentCustomerService
        .updateIdentityDetails(data)
        .subscribe((res: any) => {
          if (res['responseDto']) {
            this.notificationService.create(
              'success',
              'Success',
              'Successfully Updated ID Details',
              { nzStyle: { background: '#00A03E', color: '#fff' } }
            );
          } else if (res['errorDescription']) {
            this.notificationService.create(
              'error',
              'Error',
              res['errorDescription'],
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          } else {
            this.notificationService.create(
              'error',
              'Error',
              'ID Details Update Failed',
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        });
    }
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getCustomerDetails();
  }

  changeIdType(idType: any) {
    this.primaryIdentityUploadForm.patchValue({
      identityType: idType,
    });
  }
}
