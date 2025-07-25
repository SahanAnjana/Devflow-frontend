import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonsService } from 'src/app/_services/commons.service';
import { CoperateuserService } from 'src/app/_services/coperateuser.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

interface UploadedDocumentData {
  documentPath: string | null;
  documentName: string;
  uploadedOn: Date | null;
  uploadedBy: string;
  deletedOn: Date | null;
  deletedBy: string | null;
  agentUserCooperateSenderDetailsId: {
    agentUserCooperateSenderDetailsId: string;
  };
}
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.sass'],
})
export class DocumentationComponent {
  @Input() coorporateId: any;
  @Input() mode: any;

  allExistingDocumnts: any;
  currentDate = new Date();
  pageSize = 2;
  currentIndex = 1;
  totalRecords = 10; //need to add total records

  fileList: NzUploadFile[] = [];
  uploadedDocumentData: any; //used
  agentCustomerData: any; //used
  documentDetailsArray: UploadedDocumentData[] = [];

  constructor(
    private corperateUserService: CoperateuserService,
    private commonService: CommonsService,
    private tokenService: TokenserviceService,
    private notificationService: NzNotificationService,
    private modalRef: NzModalRef
  ) {
    this.agentCustomerData = this.commonService.parseJwt(
      tokenService.getToken()
    );
  }

  ngOnInit() {
    // this.getAllExistingDocuments();
    if (this.mode != null || this.coorporateId != null) {
      this.getAllExistingDocuments();
    }
    console.log('mode', this.mode);
    console.log('coopid', this.coorporateId);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    this.setUploadedDocumentDetails();
    return false;
  };

  setUploadedDocumentDetails() {
    this.fileList.forEach((file: NzUploadFile) => {
      this.uploadedDocumentData = {
        documentName: file.name,
      };
    });
    this.documentDetailsArray.push(this.uploadedDocumentData);
  }

  getAllExistingDocuments() {
    const data: any = {};
    data['agentUserCooperateId'] = this.coorporateId
      ? this.coorporateId
      : this.mode.agentUserCooperateId;
    this.corperateUserService.getAllDocumentData(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.allExistingDocumnts = res['responseDto'];
      }
    });
  }

  uploadNewDocuments() {
    if (this.fileList.length <= 0) {
      this.notificationService.create(
        'error',
        'Input Error',
        'At least one document should upload',
        { nzStyle: { background: '#cc2d2d', color: '#fff' } }
      );
    } else {
      const formData = new FormData();

      this.fileList.forEach((file: any) => {
        formData.append('documents', file);
        formData.append(
          'documentDetails',
          JSON.stringify(this.documentDetailsArray)
        );
      });
      const data: any = {};
      data['coorporateId'] = this.coorporateId
        ? this.coorporateId
        : this.mode.agentUserCooperateId;
      this.corperateUserService
        .uploadocument(data, formData)
        .subscribe((res: any) => {
          if (res['responseDto']) {
            const message = res['responseDto'];
            this.notificationService.create(
              'success',
              'Success',
              'Corporate Sender Details Saved Successfully',
              {
                nzStyle: { background: '#00A03E', color: '#fff' },
              }
            );
            this.fileList = [];
            this.documentDetailsArray = [];
            this.getAllExistingDocuments();
            this.closeModat();
          } else {
            this.notificationService.create(
              'error',
              'Input Error',
              res['errorDescription'],
              { nzStyle: { background: '#cc2d2d', color: '#fff' } }
            );
          }
        });
    }
  }

  downloadFile(uploademail: any) {
    const data: any = {};
    data['email'] = uploademail;

    this.corperateUserService.downloadNewUserDoc(data).subscribe((res: any) => {
      if (res['responseDto']) {
        const message = res['responseDto'];
        this.notificationService.create(
          'success',
          'Success',
          'Corporate Sender Details Saved Successfully',
          {
            nzStyle: { background: '#00A03E', color: '#fff' },
          }
        );
      }
    });
  }

  closeModat() {
    this.modalRef.close();
  }

  pageIndexChange(selectIndex: any) {
    this.currentIndex = selectIndex;
    this.getAllExistingDocuments();
  }

  removeFile(file: any) {
    this.fileList = this.fileList.filter((data: any) => data.uid !== file.uid);
    console.log(this.fileList);
    this.documentDetailsArray = this.documentDetailsArray.filter(
      (name: any) => name.documentName !== file.name
    );
    console.log(this.documentDetailsArray);
  }
}
