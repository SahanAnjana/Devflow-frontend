import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserManagementPlatformUserService } from 'src/app/_services/user-management-platform-user.service';

@Component({
  selector: 'app-platform-users-modal',
  templateUrl: './platform-users-modal.component.html',
  styleUrls: ['./platform-users-modal.component.sass'],
})
export class PlatformUsersModalComponent {
  @Input() mode: any = {};
  @Input() id: any = {};

  constructor(
    private notification: NzNotificationService,
    private platformUserService: UserManagementPlatformUserService,
    private modalref: NzModalRef
  ) {}

  ngOnInit() {}

  approveStatus() {
    const data: any = {};
    data['userId'] = this.id;
    data['status'] = true;
    this.platformUserService.approveAgent(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'User Approved successfully',
          '#ffffff',
          '#00A03E'
        );
        this.modalref.destroy();
      } else {
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }
  declineStatus() {
    const data: any = {};
    data['userId'] = this.id;
    data['status'] = false;
    this.platformUserService.approveAgent(data).subscribe((res: any) => {
      if (res['responseDto']) {
        this.createNotification(
          'success',
          'Success',
          'User Declined successfully',
          '#ffffff',
          '#00A03E'
        );
        this.modalref.destroy();
      } else {
        this.createNotification(
          'error',
          'Input Error',
          res['errorDescription'],
          '#ffffff',
          '#cc2d2d'
        );
      }
    });
  }

  createNotification(
    type: string,
    title: string,
    content: string,
    color: string,
    background: string
  ): void {
    this.notification.create(type, title, content, {
      nzStyle: {
        background: background,
        color: color,
      },
    });
  }

  cancel() {
    this.modalref.destroy();
  }
}
