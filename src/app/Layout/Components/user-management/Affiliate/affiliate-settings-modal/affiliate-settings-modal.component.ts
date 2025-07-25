import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';
import { UserManagementAffliateService } from 'src/app/_services/user-management-affliate.service';

@Component({
  selector: 'app-affiliate-settings-modal',
  templateUrl: './affiliate-settings-modal.component.html',
  styleUrls: ['./affiliate-settings-modal.component.sass'],
})
export class AffiliateSettingsModalComponent {
  @Input() mode: any;

  privilages: any;

  public unsubscribe$ = new Subject<void>();

  constructor(
    private userManagementAffliateService: UserManagementAffliateService,
    private notificationService: NzNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getPrivilages();
  }

  getPrivilages() {
    const data: any = {};

    data['email'] = this.mode.email;

    this.userManagementAffliateService
      .getPrivilages(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          this.privilages = res['responseDto'];
        }
      });
  }

  updateStatus(values: any) {
    const updatedValues = {
      ...values,
      userPrivilegeStatus: !values.userPrivilegeStatus,
    };
    this.privilages = [
      ...this.privilages.map((item: any) =>
        item === values ? updatedValues : item
      ),
    ];
    this.cdr.markForCheck();
    const formdata: any = {
      privilegeId: values.privilegeDto.privilegeId,
      userId: this.mode.userId,
      isActive: !values.userPrivilegeStatus,
    };

    this.userManagementAffliateService
      .updatePrivilagStatus(formdata)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        if (res['responseDto']) {
          const msg = res['responseDto']['message'];
          this.notificationService.create('success', 'Success', msg, {
            nzStyle: { background: '#00A03E', color: '#ffffff' },
          });
        } else if (res['errorDescription']) {
          const msg = res['errorDescription'];
          this.notificationService.create('error', 'Error', msg, {
            nzStyle: { background: '#cc2d2d', color: '#fff' },
          });
        }
      });
  }
}
