import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthserviceService } from 'src/app/_services/authservice.service';
import { UserPermissionsService } from 'src/app/_services/user-permissions.service';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Permission {
  key: string;
  module: string;
  action: string;
  enabled: boolean;
}

interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.sass'],
})
export class PermissionsComponent implements OnInit {
  // Roles data
  allRoles: Role[] = [];
  selectedRoleName: string = '';
  selectedRole: Role | null = null;
  showPermissionsTable: boolean = false;

  // Permissions data
  allPermissions: PermissionGroup[] = [];
  rolePermissions: any = {};
  loading = false;
  saving = false;

  // Pagination
  pageNumber = 1;
  pageSize = 50;

  Allroles: any = [];

  // Add Role Modal properties
  isAddRoleModalVisible = false;
  isCreatingRole = false;
  addRoleForm: FormGroup;
  selectedPermissions: string[] = [];

  constructor(
    private authService: AuthserviceService,
    private userPermissionsService: UserPermissionsService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    public dataService: DataService,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.addRoleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      permissions: [[], [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit() {
    this.initializePermissions();
    this.loadRoles();
    this.loadAllSystemPermissions();
  }

  // Check if a role is the protected System Admin role
  isSystemAdminRole(roleName: string): boolean {
    return roleName === 'System Admin';
  }

  // Check if a role can be deleted or updated
  canModifyRole(roleName: string): boolean {
    return !this.isSystemAdminRole(roleName);
  }

  // Load all available permissions from the system
  loadAllSystemPermissions() {
    this.userPermissionsService.getAllAvailablePermissions().subscribe({
      next: (response: any) => {
        console.log('All system permissions from API:', response);
        // This will help ensure we have all possible permissions
        if (response && Array.isArray(response)) {
          this.addMissingPermissionsFromAPI(response);
        }
      },
      error: (error) => {
        console.log('Could not load all system permissions from API:', error);
        // Not critical, we'll work with DataService permissions and add from role API as needed
      },
    });
  }

  loadRoles() {
    const data: any = {};
    console.log('Loading roles...');

    this.dashboardService.getAllRoles().subscribe({
      next: (res) => {
        if (res) {
          console.log('Roles loaded successfully:', res);
          this.Allroles = res;
          this.allRoles = res.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description || '',
          }));
          console.log('Processed roles:', this.allRoles);
          console.log('Allroles array length:', this.Allroles.length);
        } else {
          console.log('No roles returned from API');
        }
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.notification.error(
          'Error',
          'Failed to load roles. Please try again.'
        );
      },
    });
  }

  // Initialize all available permissions from DataService
  initializePermissions() {
    const permissionsMap = this.dataService.permisions;
    const groupedPermissions: { [key: string]: Permission[] } = {};

    console.log('DataService permissions:', permissionsMap);

    // Check if permissionsMap exists and has data
    if (!permissionsMap || Object.keys(permissionsMap).length === 0) {
      console.log(
        'No permissions found in DataService, initializing with default permissions'
      );
      // Initialize with some default permissions if DataService is empty
      this.initializeDefaultPermissions();
      return;
    }

    // Group permissions by module
    Object.keys(permissionsMap).forEach((permissionKey) => {
      const [module, action] = permissionKey.split(':');

      if (!groupedPermissions[module]) {
        groupedPermissions[module] = [];
      }

      groupedPermissions[module].push({
        key: permissionKey,
        module: module,
        action: action,
        enabled: false, // Initially all permissions are disabled
      });
    });

    // Convert to array format
    this.allPermissions = Object.keys(groupedPermissions)
      .map((module) => ({
        module: module,
        permissions: groupedPermissions[module].sort((a, b) =>
          a.action.localeCompare(b.action)
        ),
      }))
      .sort((a, b) => a.module.localeCompare(b.module));

    console.log('Initialized all permissions:', this.allPermissions);
  }

  // Initialize with default permissions if DataService is empty
  initializeDefaultPermissions() {
    const defaultPermissions = [
      // User Management
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
      // Role Management
      'role:create',
      'role:read',
      'role:update',
      'role:delete',
      // Dashboard
      'dashboard:view',
      'dashboard:manage',
      // HR Module
      'hr:view',
      'hr:manage',
      'hr:employee_create',
      'hr:employee_update',
      // Finance Module
      'finance:view',
      'finance:manage',
      'finance:budget_create',
      'finance:budget_update',
      // Project Management
      'pm:view',
      'pm:manage',
      'pm:project_create',
      'pm:project_update',
      // CRM Module
      'crm:view',
      'crm:manage',
      'crm:customer_create',
      'crm:customer_update',
      // Reports
      'reports:view',
      'reports:generate',
      'reports:export',
    ];

    const groupedPermissions: { [key: string]: Permission[] } = {};

    defaultPermissions.forEach((permissionKey) => {
      const [module, action] = permissionKey.split(':');

      if (!groupedPermissions[module]) {
        groupedPermissions[module] = [];
      }

      groupedPermissions[module].push({
        key: permissionKey,
        module: module,
        action: action,
        enabled: false,
      });
    });

    this.allPermissions = Object.keys(groupedPermissions)
      .map((module) => ({
        module: module,
        permissions: groupedPermissions[module].sort((a, b) =>
          a.action.localeCompare(b.action)
        ),
      }))
      .sort((a, b) => a.module.localeCompare(b.module));

    console.log('Initialized default permissions:', this.allPermissions);
  }

  // Handle role selection
  onUserSelect(roleName: string) {
    this.selectedRoleName = roleName;

    if (this.selectedRoleName) {
      this.loadRolePermissions(roleName);
    } else {
      this.resetPermissions();
    }
  }

  // Handle role card click
  onRoleCardClick(role: any) {
    console.log('Role card clicked:', role);
    this.selectedRoleName = role.name;
    this.selectedRole = role;
    this.showPermissionsTable = true;

    console.log('Selected role name:', this.selectedRoleName);
    console.log('Show permissions table:', this.showPermissionsTable);
    console.log('All permissions available:', this.allPermissions.length);

    if (this.selectedRoleName) {
      this.loadRolePermissions(role.name);
    } else {
      this.resetPermissions();
    }
  }

  // Handle change permissions button click
  changePermissions(role: any, event: Event) {
    event.stopPropagation(); // Prevent the card click event

    console.log('Change permissions clicked for role:', role);

    // Select the role and show permissions table
    this.selectedRoleName = role.name;
    this.selectedRole = role;
    this.showPermissionsTable = true;

    // Load the role's current permissions
    if (this.selectedRoleName) {
      this.loadRolePermissions(role.name);
    }

    // Show a notification to guide the user
    this.notification.info(
      'Change Permissions',
      `Now you can modify permissions for the "${role.name}" role using the table below. Make your changes and click "Save Permissions" when done.`
    );
  }

  loadRolePermissions(roleName: string) {
    this.loading = true;
    console.log('Loading permissions for role:', roleName);

    this.userPermissionsService.getUserPermissions(roleName).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);

        // Ensure we have permissions to display - use default if allPermissions is empty
        if (this.allPermissions.length === 0) {
          console.log('No permissions initialized, using default permissions');
          this.initializeDefaultPermissions();
        }

        // First, reset all permissions to disabled
        this.allPermissions.forEach((group) => {
          group.permissions.forEach((permission) => {
            permission.enabled = false;
          });
        });
        this.rolePermissions = {};

        // Handle the response format where permissions is an array
        if (
          response &&
          response.permissions &&
          Array.isArray(response.permissions) &&
          response.permissions.length > 0
        ) {
          console.log('Role permissions from API:', response.permissions);

          // Add any missing permissions from API to our allPermissions list
          this.addMissingPermissionsFromAPI(response.permissions);

          // Convert permissions array to object format and update states
          response.permissions.forEach((permission: string) => {
            this.rolePermissions[permission] = true;
            console.log(`Setting permission ${permission} to true`);
          });

          // Update the DataService permissions for immediate use
          this.updateDataServicePermissions(response.permissions);

          // Update all permission states
          this.updatePermissionsState();
        } else {
          console.log(
            'Role has no permissions - showing all permissions as disabled'
          );
          // Role has no permissions, but we still show all available permissions as disabled
          this.updatePermissionsState();
        }

        console.log('Final Role Permissions Object:', this.rolePermissions);
        console.log('All permissions after update:', this.allPermissions);
        this.loading = false;

        if (Object.keys(this.rolePermissions).length > 0) {
          this.notification.success(
            'Permissions Loaded',
            `Loaded ${
              Object.keys(this.rolePermissions).length
            } permissions for ${roleName}`
          );
        } else {
          this.notification.info(
            'No Permissions',
            `Role "${roleName}" has no permissions assigned`
          );
        }
      },
      error: (error) => {
        console.error('Error loading role permissions:', error);

        // Ensure we have permissions to display even on error
        if (this.allPermissions.length === 0) {
          this.initializeDefaultPermissions();
        }

        // Reset to empty permissions on error but show all permissions as disabled
        this.allPermissions.forEach((group) => {
          group.permissions.forEach((permission) => {
            permission.enabled = false;
          });
        });
        this.rolePermissions = {};
        this.loading = false;

        this.notification.error(
          'Error',
          'Failed to load role permissions. Please try again.'
        );
      },
    });
  }

  // Add any missing permissions from API to our allPermissions list
  addMissingPermissionsFromAPI(apiPermissions: string[]) {
    const existingPermissionKeys = new Set();

    // Get all existing permission keys
    this.allPermissions.forEach((group) => {
      group.permissions.forEach((permission) => {
        existingPermissionKeys.add(permission.key);
      });
    });

    // Find permissions from API that don't exist in our list
    const missingPermissions = apiPermissions.filter(
      (permission) => !existingPermissionKeys.has(permission)
    );

    if (missingPermissions.length > 0) {
      console.log('Adding missing permissions from API:', missingPermissions);

      // Group missing permissions by module
      const groupedMissingPermissions: { [key: string]: Permission[] } = {};

      missingPermissions.forEach((permissionKey) => {
        const [module, action] = permissionKey.split(':');

        if (!groupedMissingPermissions[module]) {
          groupedMissingPermissions[module] = [];
        }

        groupedMissingPermissions[module].push({
          key: permissionKey,
          module: module,
          action: action,
          enabled: false,
        });
      });

      // Add missing permissions to existing groups or create new groups
      Object.keys(groupedMissingPermissions).forEach((module) => {
        const existingGroup = this.allPermissions.find(
          (group) => group.module === module
        );

        if (existingGroup) {
          // Add to existing group
          existingGroup.permissions.push(...groupedMissingPermissions[module]);
          // Re-sort the permissions in this group
          existingGroup.permissions.sort((a, b) =>
            a.action.localeCompare(b.action)
          );
        } else {
          // Create new group
          this.allPermissions.push({
            module: module,
            permissions: groupedMissingPermissions[module].sort((a, b) =>
              a.action.localeCompare(b.action)
            ),
          });
        }
      });

      // Re-sort all groups
      this.allPermissions.sort((a, b) => a.module.localeCompare(b.module));

      console.log(
        'Updated allPermissions with API permissions:',
        this.allPermissions
      );
    }
  }

  // Update permissions state based on role permissions
  updatePermissionsState() {
    console.log(
      'Updating permissions state with role permissions:',
      this.rolePermissions
    );
    console.log('Total permissions to check:', this.getTotalPermissionsCount());

    let enabledCount = 0;
    let totalCount = 0;

    this.allPermissions.forEach((group) => {
      group.permissions.forEach((permission) => {
        totalCount++;
        // Check if this permission is in the role's permissions
        const wasEnabled = permission.enabled;
        permission.enabled = this.rolePermissions[permission.key] === true;

        if (permission.enabled) {
          enabledCount++;
        }

        if (wasEnabled !== permission.enabled) {
          console.log(
            `Permission ${permission.key}: ${
              wasEnabled ? 'ENABLED' : 'DISABLED'
            } -> ${permission.enabled ? 'ENABLED' : 'DISABLED'}`
          );
        }
      });
    });

    console.log(
      `Updated permissions state: ${enabledCount}/${totalCount} permissions enabled`
    );
    console.log('Updated all permissions state:', this.allPermissions);
  }

  // Update DataService permissions for immediate application access
  updateDataServicePermissions(permissions: string[]) {
    // Reset all permissions in data service to false
    Object.keys(this.dataService.permisions).forEach((key) => {
      this.dataService.permisions[key] = false;
    });

    // Set only the active permissions to true
    permissions.forEach((permission) => {
      if (this.dataService.permisions.hasOwnProperty(permission)) {
        this.dataService.permisions[permission] = true;
      }
    });

    console.log(
      'Updated DataService permissions:',
      this.dataService.permisions
    );
  }

  // Reset all permissions to false
  resetPermissions() {
    console.log('Resetting all permissions to disabled state');

    this.allPermissions.forEach((group) => {
      group.permissions.forEach((permission) => {
        permission.enabled = false;
      });
    });

    this.rolePermissions = {};
    this.showPermissionsTable = false;
    console.log('All permissions reset');
  }

  // Reset permissions but keep table visible
  resetPermissionsOnly() {
    console.log('Resetting permissions only (keeping table visible)');

    this.allPermissions.forEach((group) => {
      group.permissions.forEach((permission) => {
        permission.enabled = false;
      });
    });

    this.rolePermissions = {};
    console.log('Permissions reset (table remains visible)');
  }

  // Toggle permission for a role
  onPermissionToggle(permission: Permission) {
    if (!this.selectedRoleName) {
      this.notification.warning('Warning', 'Please select a role first');
      // Revert the switch state if no role is selected
      permission.enabled = !permission.enabled;
      return;
    }

    console.log(
      `Permission ${permission.key} toggled to: ${permission.enabled}`
    );

    // Update the rolePermissions object with the new state
    this.rolePermissions[permission.key] = permission.enabled;

    // Show immediate feedback
    const status = permission.enabled ? 'enabled' : 'disabled';
    this.notification.info(
      'Permission Updated',
      `${this.formatActionName(
        permission.action
      )} permission for ${this.formatModuleName(
        permission.module
      )} has been ${status}. Don't forget to save changes.`
    );
  }

  // Toggle all permissions for a module
  onModuleToggle(group: PermissionGroup, enabled: boolean) {
    if (!this.selectedRoleName) {
      this.notification.warning('Warning', 'Please select a role first');
      return;
    }

    group.permissions.forEach((permission) => {
      permission.enabled = enabled;
      this.rolePermissions[permission.key] = enabled;
    });
  }

  // Check if all permissions in a module are enabled
  isModuleFullyEnabled(group: PermissionGroup): boolean {
    return group.permissions.every((permission) => permission.enabled);
  }

  // Check if some permissions in a module are enabled
  isModulePartiallyEnabled(group: PermissionGroup): boolean {
    return (
      group.permissions.some((permission) => permission.enabled) &&
      !this.isModuleFullyEnabled(group)
    );
  }

  // Save permissions for selected role
  savePermissions() {
    if (!this.selectedRoleName || !this.selectedRole) {
      this.notification.warning('Warning', 'Please select a role first');
      return;
    }

    // Check if this is the System Admin role
    if (this.isSystemAdminRole(this.selectedRoleName)) {
      this.notification.warning(
        'Cannot Update Permissions',
        'The System Admin role is protected and its permissions cannot be modified.'
      );
      return;
    }

    this.saving = true;

    // Convert rolePermissions object back to array format for API
    const enabledPermissions = Object.keys(this.rolePermissions).filter(
      (key) => this.rolePermissions[key] === true
    );

    console.log('Saving permissions:', enabledPermissions);
    console.log('Selected role:', this.selectedRole);

    // Prepare the request body according to the API specification
    const requestBody = {
      name: this.selectedRole.name,
      description: this.selectedRole.description || '',
      permissions: enabledPermissions,
    };

    console.log('Request body:', requestBody);

    this.userPermissionsService
      .updateRolePermissions(this.selectedRole.id, requestBody)
      .subscribe({
        next: (response: any) => {
          console.log('Permissions update response:', response);

          // Update DataService permissions immediately
          this.updateDataServicePermissions(enabledPermissions);

          this.notification.success(
            'Success',
            `Role permissions updated successfully for ${this.selectedRoleName}. ${enabledPermissions.length} permissions are now active.`
          );
          this.saving = false;

          // Reload permissions to ensure consistency
          this.loadRolePermissions(this.selectedRoleName);
        },
        error: (error) => {
          console.error('Error saving permissions:', error);
          this.notification.error(
            'Error',
            'Failed to update role permissions. Please check your connection and try again.'
          );
          this.saving = false;
        },
      });
  }

  // Get permission count for a module
  getEnabledPermissionsCount(group: PermissionGroup): number {
    return group.permissions.filter((permission) => permission.enabled).length;
  }

  // Format module name for display
  formatModuleName(module: string): string {
    return (
      module.charAt(0).toUpperCase() +
      module.slice(1).replace(/([A-Z])/g, ' $1')
    );
  }

  // Format action name for display
  formatActionName(action: string): string {
    return action.charAt(0).toUpperCase() + action.slice(1);
  }

  // Get count of enabled permissions
  getEnabledPermissionsTotal(): number {
    return Object.keys(this.rolePermissions).filter(
      (key) => this.rolePermissions[key]
    ).length;
  }

  // Get total number of permissions
  getTotalPermissionsCount(): number {
    return this.allPermissions.reduce(
      (total, group) => total + group.permissions.length,
      0
    );
  }

  // Check if the selected role has any permissions
  hasPermissionsInRole(): boolean {
    const enabledCount = this.getEnabledPermissionsTotal();
    const hasPermissions = enabledCount > 0;
    console.log(
      `hasPermissionsInRole() - Role: ${this.selectedRoleName}, Enabled: ${enabledCount}, HasPermissions: ${hasPermissions}`
    );
    return hasPermissions;
  }

  // Get flattened permissions data for table
  getPermissionsTableData(): Permission[] {
    const tableData: Permission[] = [];

    console.log(
      'Getting table data, allPermissions length:',
      this.allPermissions.length
    );

    this.allPermissions.forEach((group) => {
      group.permissions.forEach((permission) => {
        tableData.push(permission);
      });
    });

    console.log(
      'Table data with current states:',
      tableData.map((p) => ({
        key: p.key,
        enabled: p.enabled,
        module: p.module,
        action: p.action,
      }))
    );

    console.log('Total table data items:', tableData.length);
    return tableData;
  }

  // Get module group by module name
  getModuleGroup(moduleName: string): PermissionGroup | undefined {
    return this.allPermissions.find((group) => group.module === moduleName);
  }

  // Get permission description based on action
  getPermissionDescription(action: string): string {
    const descriptions: { [key: string]: string } = {
      create: 'Allows creating new records',
      read: 'Allows viewing and reading records',
      update: 'Allows editing and updating records',
      delete: 'Allows deleting records',
    };
    return descriptions[action] || 'Permission to perform this action';
  }

  // Check if this is the first permission of a module (for showing module toggle button)
  isFirstPermissionOfModule(permission: Permission): boolean {
    const moduleGroup = this.getModuleGroup(permission.module);
    if (!moduleGroup) return false;
    return moduleGroup.permissions[0].key === permission.key;
  }

  // Safe method to get enabled permissions count for a module
  getSafeEnabledPermissionsCount(moduleName: string): number {
    const moduleGroup = this.getModuleGroup(moduleName);
    return moduleGroup ? this.getEnabledPermissionsCount(moduleGroup) : 0;
  }

  // Safe method to get total permissions count for a module
  getSafeTotalPermissionsCount(moduleName: string): number {
    const moduleGroup = this.getModuleGroup(moduleName);
    return moduleGroup ? moduleGroup.permissions.length : 0;
  }

  // Safe method to toggle module permissions
  safeToggleModule(moduleName: string): void {
    const moduleGroup = this.getModuleGroup(moduleName);
    if (moduleGroup) {
      this.onModuleToggle(moduleGroup, !this.isModuleFullyEnabled(moduleGroup));
    }
  }

  // Safe method to check if module is fully enabled
  isSafeModuleFullyEnabled(moduleName: string): boolean {
    const moduleGroup = this.getModuleGroup(moduleName);
    return moduleGroup ? this.isModuleFullyEnabled(moduleGroup) : false;
  }

  // Reset a single permission
  resetSinglePermission(permission: Permission): void {
    if (!this.selectedRoleName) {
      this.notification.warning('Warning', 'Please select a role first');
      return;
    }

    permission.enabled = false;
    this.rolePermissions[permission.key] = false;
    this.notification.info(
      'Info',
      `Permission ${permission.key} has been reset for role ${this.selectedRoleName}`
    );
  }

  // Add Role Modal Methods
  submitAddRole(): void {
    if (this.addRoleForm.valid) {
      this.isCreatingRole = true;

      const roleData = {
        name: this.addRoleForm.get('name')?.value,
        description: this.addRoleForm.get('description')?.value || '',
        permissions: this.addRoleForm.get('permissions')?.value || [],
      };

      this.createRole(roleData);
    } else {
      this.markFormGroupTouched(this.addRoleForm);
    }
  }

  createRole(roleData: any): void {
    const url = `${environment.baseUrl}8000/auth/roles`;

    this.http.post(url, roleData).subscribe({
      next: (response: any) => {
        this.notification.success(
          'Success',
          `Role "${roleData.name}" created successfully!`
        );
        this.hideAddRoleModal();
        this.loadRoles(); // Refresh the roles list
        this.isCreatingRole = false;
      },
      error: (error) => {
        console.error('Error creating role:', error);
        this.notification.error(
          'Error',
          error.error?.message || `Failed to create role "${roleData.name}"`
        );
        this.isCreatingRole = false;
      },
    });
  }

  // Delete Role Method
  deleteRole(role: any, event: Event): void {
    // Stop event propagation to prevent card click
    event.stopPropagation();

    // Check if this is the System Admin role
    if (this.isSystemAdminRole(role.name)) {
      this.notification.warning(
        'Cannot Delete Role',
        'The System Admin role is protected and cannot be deleted.'
      );
      return;
    }

    this.modalService.confirm({
      nzTitle: 'Delete Role',
      nzContent: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.performDeleteRole(role);
      },
    });
  }

  private performDeleteRole(role: any): void {
    const url = `${environment.baseUrl}8000/auth/roles/${role.id}`;

    this.http.delete(url).subscribe({
      next: (response: any) => {
        this.notification.success(
          'Success',
          `Role "${role.name}" deleted successfully!`
        );

        // If the deleted role was selected, clear the selection
        if (this.selectedRoleName === role.name) {
          this.selectedRoleName = '';
          this.selectedRole = null;
          this.showPermissionsTable = false;
          this.resetPermissions();
        }

        this.loadRoles(); // Refresh the roles list
      },
      error: (error) => {
        console.error('Error deleting role:', error);
        this.notification.error(
          'Error',
          error.error?.message || `Failed to delete role "${role.name}"`
        );
      },
    });
  }

  // Form validation helpers for Add Role
  isAddRoleFieldInvalid(fieldName: string): boolean {
    const field = this.addRoleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getAddRoleFieldError(fieldName: string): string {
    const field = this.addRoleForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        if (fieldName === 'permissions') {
          return 'At least one permission must be selected';
        }
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors?.['minlength']) {
        if (fieldName === 'permissions') {
          return 'At least one permission must be selected';
        }
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
    }
    return '';
  }

  // Handle permission selection change
  onPermissionSelectionChange(selectedPermissions: string[]): void {
    this.selectedPermissions = selectedPermissions;
    this.addRoleForm.patchValue({ permissions: selectedPermissions });
    console.log('Selected permissions:', selectedPermissions);
  }

  // Reset add role modal
  resetAddRoleModal(): void {
    this.selectedPermissions = [];
    this.addRoleForm.reset();
    this.addRoleForm.patchValue({
      name: '',
      description: '',
      permissions: [],
    });
  }

  // Override showAddRoleModal to reset properly
  showAddRoleModal(): void {
    this.isAddRoleModalVisible = true;
    this.resetAddRoleModal();

    // Ensure we have permissions available for selection
    if (this.allPermissions.length === 0) {
      this.initializeDefaultPermissions();
    }
  }

  // Override hideAddRoleModal to reset properly
  hideAddRoleModal(): void {
    this.isAddRoleModalVisible = false;
    this.isCreatingRole = false;
    this.resetAddRoleModal();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
