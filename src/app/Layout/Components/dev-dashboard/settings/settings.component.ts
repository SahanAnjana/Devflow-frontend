import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { TokenserviceService } from 'src/app/_services/tokenservice.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {
  notificationForm!: FormGroup;
  securityForm!: FormGroup;
  preferenceForm!: FormGroup;
  loading = false;
  activeTab = 0;
  
  // Settings data
  currentUser: any = {};
  
  // Notification settings
  emailNotifications = {
    projectUpdates: true,
    taskAssignments: true,
    teamMessages: true,
    systemUpdates: false,
    weeklyReports: true,
    securityAlerts: true
  };
  
  // Security settings
  securitySettings = {
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceTracking: true
  };
  
  // Appearance settings
  appearanceSettings = {
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
    sidebarCollapsed: false
  };

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private dataService: DataService,
    private tokenService: TokenserviceService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadSettings();
  }

  initializeForms(): void {
    this.notificationForm = this.fb.group({
      projectUpdates: [this.emailNotifications.projectUpdates],
      taskAssignments: [this.emailNotifications.taskAssignments],
      teamMessages: [this.emailNotifications.teamMessages],
      systemUpdates: [this.emailNotifications.systemUpdates],
      weeklyReports: [this.emailNotifications.weeklyReports],
      securityAlerts: [this.emailNotifications.securityAlerts]
    });

    this.securityForm = this.fb.group({
      twoFactorEnabled: [this.securitySettings.twoFactorEnabled],
      sessionTimeout: [this.securitySettings.sessionTimeout, [Validators.min(5), Validators.max(480)]],
      loginAlerts: [this.securitySettings.loginAlerts],
      deviceTracking: [this.securitySettings.deviceTracking]
    });

    this.preferenceForm = this.fb.group({
      theme: [this.appearanceSettings.theme],
      language: [this.appearanceSettings.language],
      dateFormat: [this.appearanceSettings.dateFormat],
      timezone: [this.appearanceSettings.timezone],
      sidebarCollapsed: [this.appearanceSettings.sidebarCollapsed]
    });
  }

  loadSettings(): void {
    this.loading = true;
    
    // Load user settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // Update forms with saved settings
      if (settings.notifications) {
        this.emailNotifications = { ...this.emailNotifications, ...settings.notifications };
        this.notificationForm.patchValue(this.emailNotifications);
      }
      
      if (settings.security) {
        this.securitySettings = { ...this.securitySettings, ...settings.security };
        this.securityForm.patchValue(this.securitySettings);
      }
      
      if (settings.appearance) {
        this.appearanceSettings = { ...this.appearanceSettings, ...settings.appearance };
        this.preferenceForm.patchValue(this.appearanceSettings);
      }
    }
    
    this.loading = false;
  }

  onNotificationSubmit(): void {
    if (this.notificationForm.valid) {
      this.loading = true;
      
      const formData = this.notificationForm.value;
      this.emailNotifications = { ...this.emailNotifications, ...formData };
      
      // Save to localStorage
      this.saveSettings();
      
      setTimeout(() => {
        this.message.success('Notification settings saved successfully!');
        this.loading = false;
      }, 1000);
    }
  }

  onSecuritySubmit(): void {
    if (this.securityForm.valid) {
      this.loading = true;
      
      const formData = this.securityForm.value;
      this.securitySettings = { ...this.securitySettings, ...formData };
      
      // Save to localStorage
      this.saveSettings();
      
      setTimeout(() => {
        this.message.success('Security settings updated successfully!');
        this.loading = false;
      }, 1000);
    }
  }

  onPreferenceSubmit(): void {
    if (this.preferenceForm.valid) {
      this.loading = true;
      
      const formData = this.preferenceForm.value;
      this.appearanceSettings = { ...this.appearanceSettings, ...formData };
      
      // Apply theme changes immediately
      this.applyTheme(formData.theme);
      
      // Save to localStorage
      this.saveSettings();
      
      setTimeout(() => {
        this.message.success('Preferences saved successfully!');
        this.loading = false;
      }, 1000);
    }
  }

  private saveSettings(): void {
    const allSettings = {
      notifications: this.emailNotifications,
      security: this.securitySettings,
      appearance: this.appearanceSettings,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('userSettings', JSON.stringify(allSettings));
  }

  private applyTheme(theme: string): void {
    // Apply theme changes to the document
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  resetAllSettings(): void {
    this.modal.confirm({
      nzTitle: 'Reset All Settings',
      nzContent: 'Are you sure you want to reset all settings to default values? This action cannot be undone.',
      nzOkText: 'Reset',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.resetToDefaults();
      }
    });
  }

  private resetToDefaults(): void {
    // Reset to default values
    this.emailNotifications = {
      projectUpdates: true,
      taskAssignments: true,
      teamMessages: true,
      systemUpdates: false,
      weeklyReports: true,
      securityAlerts: true
    };
    
    this.securitySettings = {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true,
      deviceTracking: true
    };
    
    this.appearanceSettings = {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'UTC',
      sidebarCollapsed: false
    };
    
    // Update forms
    this.notificationForm.patchValue(this.emailNotifications);
    this.securityForm.patchValue(this.securitySettings);
    this.preferenceForm.patchValue(this.appearanceSettings);
    
    // Apply theme
    this.applyTheme('light');
    
    // Clear localStorage
    localStorage.removeItem('userSettings');
    
    this.message.success('All settings have been reset to defaults!');
  }

  exportSettings(): void {
    const settingsData = {
      notifications: this.emailNotifications,
      security: this.securitySettings,
      appearance: this.appearanceSettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.message.success('Settings exported successfully!');
  }

  importSettings(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        
        // Validate and apply imported settings
        if (importedSettings.notifications) {
          this.emailNotifications = { ...this.emailNotifications, ...importedSettings.notifications };
          this.notificationForm.patchValue(this.emailNotifications);
        }
        
        if (importedSettings.security) {
          this.securitySettings = { ...this.securitySettings, ...importedSettings.security };
          this.securityForm.patchValue(this.securitySettings);
        }
        
        if (importedSettings.appearance) {
          this.appearanceSettings = { ...this.appearanceSettings, ...importedSettings.appearance };
          this.preferenceForm.patchValue(this.appearanceSettings);
          this.applyTheme(this.appearanceSettings.theme);
        }
        
        // Save the imported settings
        this.saveSettings();
        
        this.message.success('Settings imported successfully!');
      } catch (error) {
        this.message.error('Invalid settings file format!');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  }

  enable2FA(): void {
    this.modal.info({
      nzTitle: 'Enable Two-Factor Authentication',
      nzContent: 'Two-factor authentication adds an extra layer of security to your account. You will need to use an authenticator app to generate codes when logging in.',
      nzOkText: 'Continue',
      nzOnOk: () => {
        // Implement 2FA setup logic here
        this.message.info('Two-factor authentication setup will be implemented in the next version.');
      }
    });
  }

  switchTab(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  getNotificationCount(): number {
    return Object.values(this.emailNotifications).filter(Boolean).length;
  }

  getSecurityScore(): number {
    let score = 0;
    if (this.securitySettings.twoFactorEnabled) score += 25;
    if (this.securitySettings.loginAlerts) score += 25;
    if (this.securitySettings.deviceTracking) score += 25;
    if (this.securitySettings.sessionTimeout <= 60) score += 25;
    return score;
  }

  getSecurityScoreColor(): string {
    const score = this.getSecurityScore();
    if (score >= 75) return 'green';
    if (score >= 50) return 'orange';
    return 'red';
  }
}
