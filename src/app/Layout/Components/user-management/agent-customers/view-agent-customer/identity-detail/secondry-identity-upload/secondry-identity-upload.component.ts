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
import { DataService } from 'src/app/_services/shared-data/data.service';
import format from 'date-fns/format';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';

@Component({
  selector: 'app-secondry-identity-upload',
  templateUrl: './secondry-identity-upload.component.html',
  styleUrls: ['./secondry-identity-upload.component.sass'],
})
export class SecondryIdentityUploadComponent {
  currentPageIndex = 1;
  pageNumber = 1;
  pageSize = 5;

  totalRecord = 0;
  public secondrydentityUploadForm!: FormGroup;
  receivedCustomerData: any;
  customerDetailsId: any;
  customerData: any[] = [];

  previewModalVisible = false;
  viewSecondary = false;
  secondaryUploading = false;
  secondaryFileList: any[] = [];
  secondaryLoading = false;
  secondaryAvatarUrl!: string;
  secondaryImageName!: string;
  secondaryUploaded = false;

  uploadedImages = [];
  selectedAvatarUrl!: string;
  pdfpath: any;
  previewModalPdf = false;

  ///////temporary services
  customerIdentityImageDataService: any;
  amlcoreCustomerDataService: any;
  amlSearchDataService: any;

  fileName = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NzNotificationService,
    private dataService: DataService,
    private agentCustomerService: AgentCustomerService,
    // private customerIdentityImageDataService: CustomerIdentityImageDataService,
    private modalRef: NzModalRef // private amlSearchDataService: AmlSearchDataService, // private amlcoreCustomerDataService: AmlCustomerDataService
  ) {}

  ngOnInit() {
    this.secondrydentityUploadForm = this.formBuilder.group({
      secondaryIdType: [null, Validators.required],
    });

    this.getCustomerDetails();
  }

  get secondaryIdType() {
    return this.secondrydentityUploadForm.get('secondaryIdType');
  }

  getFieldName(option: any): any {
    switch (option) {
      case 'secondaryIdType': {
        return 'Secondary Id Type';
      }
    }
  }

  dateFormatter(date: string) {
    return format(new Date(date), 'yyyy-MM-dd');
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
            'Front Image cannot be empty',
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

  handleCancel(): void {
    this.previewModalVisible = false;
    this.viewSecondary = false;
  }

  viewSecondaryIdPreview() {
    this.viewSecondary = true;
    this.previewModalVisible = true;
  }

  beforeSecondaryUpload = (file: NzUploadFile): boolean => {
    const lastIndex = file['name'].lastIndexOf('.');
    this.secondaryImageName = file['name'].substr(0, lastIndex) + '.jpeg';
    this.getBase64(file, (img: string) => {
      this.secondaryLoading = false;
      this.secondaryAvatarUrl = img;
    });

    this.secondaryFileList = this.secondaryFileList.concat(file);
    this.secondaryUploaded = true;

    return false;
  };

  removeSecondaryData = (file: NzUploadFile): boolean => {
    this.secondaryImageName = '';
    this.secondaryAvatarUrl = '';
    return true;
  };

  private getBase64(img: NzUploadFile, callback: (img: string) => void): void {
    const reader = new FileReader();
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    // @ts-ignore
    reader.readAsDataURL(img);
  }
  update() {
    if (!this.secondrydentityUploadForm.valid) {
      this.validateAllFormFields(this.secondrydentityUploadForm);
      return;
    } else if (this.secondaryFileList.length == 0) {
      this.notificationService.create(
        'error',
        'Input Error',
        'Secondary file cannot be empty',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      this.uploadSecondaryID();
    }
  }
  uploadSecondaryID() {
    const data: any = {
      secondaryIdType: this.secondaryIdType?.value,
    };

    if (this.dataService.selectedData.customerDetailsId === null) {
      this.notificationService.create(
        'error',
        'Error',
        'User not properly SignUp to the System.',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      let formData = new FormData();
      formData.append('secondaryFile', this.secondaryFileList[0]);

      this.agentCustomerService
        .customerImageDetailsSecondaryUpload(
          formData,
          data,
          this.dataService.selectedData.customerDetailsId
        )
        .subscribe({
          next: (res: any) => {
            if (res['responseDto']) {
              this.clear();
              this.notificationService.create(
                'success',
                'Success',
                res['responseDto'],
                { nzStyle: { background: '#00A03E', color: '#fff' } }
              );
              this.getCustomerDetails();
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
                'Image Upload Failed',
                { nzStyle: { background: '#cc2d2d', color: '#fff' } }
              );
            }
          },
        });
    }
  }
  clear() {
    this.secondaryFileList = [];
    this.secondaryImageName = '';
    this.secondaryAvatarUrl = '';
    this.secondrydentityUploadForm.reset();
  }

  getCustomerDetails() {
    const data: any = {};
    data['customerDetailsId'] = this.dataService.selectedData.customerDetailsId;
    data['pageSize'] = this.pageSize;
    data['pageNumber'] = this.pageNumber;

    this.agentCustomerService
      .getAllretrieveAllSecondaryids(data)
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

  viewImage(receivedData: any) {
    if (receivedData.imageName.split('.').pop() === 'pdf') {
      this.pdfpath = this._base64ToArrayBuffer(receivedData.imagePath);
      this.previewModalPdf = true;
    } else if (
      receivedData.imageName.split('.').pop() === 'png' ||
      receivedData.imageName.split('.').pop() === 'jpeg' ||
      receivedData.imageName.split('.').pop() === 'jpg'
    ) {
      this.selectedAvatarUrl =
        'data:image/jpeg;base64,' + receivedData.imagePath;
      this.viewSecondary = true;
      this.previewModalVisible = true;
    } else {
      this.notificationService.create(
        'error',
        'Error',
        'Unable to Preview documents type invalid check download',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
      var a = document.createElement('a'); //Create <a>
      a.href = `data:application/${receivedData.imageName
        .split('.')
        .pop()};base64,${receivedData.imagePath}`; //Image Base64 Goes here
      a.download = receivedData.imageName; //File name Here
      a.click(); //Downloaded file
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }

  handleCancelPdf(): void {
    this.previewModalPdf = false;
  }
  _base64ToArrayBuffer(base64: any) {
    var binary_string = base64.replace(/\\n/g, '');
    binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  pageIndexChange(selectedIndex: any) {
    this.currentPageIndex = selectedIndex;
    this.pageNumber = selectedIndex;
    this.getCustomerDetails();
  }
}
