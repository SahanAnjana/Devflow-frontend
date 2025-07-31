import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';
import { CommonsService } from 'src/app/_services/commons.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  avatarUrl?: string;
  currentUser: any = {};
  activeTab = 0;
  
  // Password visibility toggles
  passwordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dataService: DataService,
    private tokenService: TokenserviceService,
    private commonService: CommonsService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserProfile();
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]],
      department: [''],
      position: [''],
      bio: ['', [Validators.maxLength(500)]],
      location: [''],
      timezone: ['UTC']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    confirmPassword?.setErrors(null);
    return null;
  }

  loadUserProfile(): void {
    this.loading = true;
    
    // Get user info from token using CommonService
    this.currentUser = this.commonService.parseJwt(this.tokenService.getToken());
    
    // Populate form with user data
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.given_name || '',
        lastName: this.currentUser.family_name || '',
        email: this.currentUser.email || this.currentUser.sub || '',
        phone: this.currentUser.phone || '',
        department: this.currentUser.department || '',
        position: this.currentUser.position || '',
        bio: this.currentUser.bio || '',
        location: this.currentUser.location || '',
        timezone: this.currentUser.timezone || 'UTC'
      });
      
      this.avatarUrl = this.currentUser.avatar || undefined;
    }
    
    this.loading = false;
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      
      const formData = this.profileForm.getRawValue();
      
      // Simulate API call
      setTimeout(() => {
        this.message.success('Profile updated successfully!');
        this.loading = false;
        
        // Update local storage or data service if needed
        this.message.success('Profile updated successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched(this.profileForm);
      this.message.error('Please fill in all required fields correctly.');
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      
      const passwordData = this.passwordForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.message.success('Password changed successfully!');
        this.passwordForm.reset();
        this.loading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.passwordForm);
      this.message.error('Please fill in all fields correctly.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.error('You can only upload JPG/PNG files!');
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must be smaller than 2MB!');
      return false;
    }
    return true;
  };

  handleChange(info: NzUploadChangeParam): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
          this.message.success('Avatar uploaded successfully!');
        });
        break;
      case 'error':
        this.message.error('Avatar upload failed.');
        this.loading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  getUserInitials(): string {
    const firstName = this.profileForm.get('firstName')?.value || '';
    const lastName = this.profileForm.get('lastName')?.value || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  switchTab(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  resetProfile(): void {
    this.loadUserProfile();
    this.message.info('Profile data reset to original values.');
  }

  exportProfile(): void {
    const profileData = {
      ...this.profileForm.getRawValue(),
      exportDate: new Date().toISOString(),
      userId: this.currentUser.sub
    };
    
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `profile-${this.currentUser.sub}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.message.success('Profile data exported successfully!');
  }
}
