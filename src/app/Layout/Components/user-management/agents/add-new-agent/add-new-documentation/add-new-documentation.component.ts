import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AgentService } from 'src/app/_services/agent.service';

@Component({
  selector: 'app-add-new-documentation',
  templateUrl: './add-new-documentation.component.html',
  styleUrls: ['./add-new-documentation.component.sass'],
})
export class AddNewDocumentationComponent {
  fileList: NzUploadFile[] = [];
  uploadedDocumentData: any;
  documentList: any[] = [];
  documentFileList: any[] = [];
  frontAvatarUrl!: string;
  basicInformationForm!: FormGroup;
  @Input() formGroupName: any;
  constructor(
    public agentService: AgentService,
    private rootFormGroup: FormGroupDirective
  ) {}

  ngOnInit() {
    this.basicInformationForm = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;

    this.getAllDocumentTypes();
  }
  private getBase64(img: NzUploadFile, callback: (img: string) => void): void {
    const reader = new FileReader();
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    // @ts-ignore
    reader.readAsDataURL(img);
  }
  getAllDocumentTypes() {
    this.agentService.getDocumentTypes().subscribe({
      next: (res: any) => {
        if (res['responseDto']) {
          this.documentList = res['responseDto'];
        }
      },
    });
  }
  removeFrontData = (file: NzUploadFile): boolean => {
    this.frontAvatarUrl = '';
    return true;
  };
  beforeFrontUpload = (file: NzUploadFile): boolean => {
    this.getBase64(file, (img: string) => {
      this.frontAvatarUrl = img;
    });

    this.agentService.documentList =
      this.agentService.documentList.concat(file);
    // this.agentService.documentList = this.agentService.documentList;
    console.log('file', this.documentFileList);

    return false;
  };
  removeFile(file: any) {
    this.agentService.documentList = this.agentService.documentList.filter(
      (data: any) => data.uid !== file.uid
    );
    console.log(this.agentService.documentList);
  }
}
