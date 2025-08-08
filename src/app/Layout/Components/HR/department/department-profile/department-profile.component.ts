import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-department-profile',
  templateUrl: './department-profile.component.html',
  styleUrls: ['./department-profile.component.sass'],
})
export class DepartmentProfileComponent {
  @Input() data: any;

  constructor(private modal: NzModalRef) {}

  ngOnInit() {
    console.log('Department data:', this.data);
  }

  getInitials(name: string): string {
    if (!name) return 'D';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }

  getDepartmentStatus(): string {
    // You can implement logic to determine department status
    // For now, we'll use a simple active/inactive logic
    return this.data?.is_active !== false ? 'Active' : 'Inactive';
  }

  getStatusColor(): string {
    const status = this.getDepartmentStatus();
    return status === 'Active' ? '#52c41a' : '#ff4d4f';
  }

  closeModal(): void {
    this.modal.destroy();
  }
}
