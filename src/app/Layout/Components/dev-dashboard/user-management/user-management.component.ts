import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { DepartmentService } from 'src/app/_services/hr-services/department.service';
import { environment } from 'src/environments/environment';

interface ApiUser {
  id: string;
  email: string;
  is_active: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  // Derived properties for display
  firstName?: string;
  lastName?: string;
  username?: string;
  department?: string;
  lastLogin?: string;
  phone?: string;
}

interface UpdateUserRequest {
  email: string;
  password?: string;
  is_active: boolean;
  role: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.sass'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  // Debug mode flag
  debugMode = true;

  // Data properties
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm = '';

  // Modal properties
  isAddUserModalVisible = false;
  isEditUserModalVisible = false;
  isViewUserModalVisible = false;
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  viewUserForm: FormGroup;
  modalLoading = false;
  selectedUser: User | null = null;
  selectedUserDetails: ApiUser | null = null;

  // Available roles and departments
  availableRoles: any[] = []; // Will be loaded from API
  availableDepartments: any[] = []; // Will be loaded from HR API

  // Component lifecycle
  private componentDestroyed = false;
  show = false;
  constructor(
    private http: HttpClient,
    public dataService: DataService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private dashboardService: DashboardService,
    private departmentService: DepartmentService
  ) {
    if (this.debugMode) console.log('🔧 User Management constructor called');

    // Initialize forms
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      department: ['', Validators.required],
      phone: [''],
      status: ['active', Validators.required],
    });

    this.editUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      department: ['', Validators.required],
      phone: [''],
      status: ['', Validators.required],
    });

    this.viewUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required],
      is_active: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.debugMode) console.log('🔧 User Management ngOnInit called');

    try {
      this.loadRoles(); // Load roles from API
      this.loadDepartments(); // Load departments from HR API
      this.fetchUsers();
    } catch (error) {
      console.error('❌ Error in User Management ngOnInit:', error);
      this.error = 'Error initializing User Management';
    }

    this.isCurrentUserAdmin();
  }

  ngOnDestroy(): void {
    if (this.debugMode) console.log('🔧 User Management ngOnDestroy called');
    this.componentDestroyed = true;
  }

  // Load all available roles from API
  loadRoles(): void {
    if (this.debugMode) console.log('🔧 Loading roles from API...');

    this.dashboardService.getAllRoles().subscribe({
      next: (res) => {
        if (res) {
          if (this.debugMode) console.log('✅ Roles loaded successfully:', res);

          // Transform the API response to match our dropdown format
          this.availableRoles = res.map((role: any) => ({
            label: role.name,
            value: role.name,
            id: role.id,
            description: role.description || '',
          }));

          if (this.debugMode)
            console.log(
              '🔄 Processed roles for dropdown:',
              this.availableRoles
            );
        } else {
          console.warn('⚠️ No roles returned from API');
          this.notification.warning('Warning', 'No roles found in the system');
        }
      },
      error: (error) => {
        console.error('❌ Error loading roles:', error);
        this.notification.error(
          'Error',
          'Failed to load roles. Please try again.'
        );

        // Fallback to basic roles if API fails
        this.availableRoles = [
          { label: 'User', value: 'user' },
          { label: 'Admin', value: 'Admin' },
        ];
      },
    });
  }

  // Load all available departments from HR API
  loadDepartments(): void {
    if (this.debugMode) console.log('🔧 Loading departments from HR API...');

    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          if (this.debugMode)
            console.log('✅ Departments loaded successfully:', res);

          // Transform the API response to match our dropdown format
          this.availableDepartments = res.map((dept: any) => ({
            label: dept.name || dept.department_name || dept.title,
            value: dept.name || dept.department_name || dept.title,
            id: dept.id,
            description: dept.description || '',
          }));

          if (this.debugMode)
            console.log(
              '🔄 Processed departments for dropdown:',
              this.availableDepartments
            );
        } else {
          console.warn('⚠️ No departments returned from API');
          this.notification.warning(
            'Warning',
            'No departments found in the system'
          );

          // Fallback to basic departments if API returns empty
          this.availableDepartments = [
            { label: 'IT', value: 'IT' },
            { label: 'HR', value: 'HR' },
            { label: 'Finance', value: 'Finance' },
            { label: 'General', value: 'General' },
          ];
        }
      },
      error: (error) => {
        console.error('❌ Error loading departments:', error);
        this.notification.error(
          'Error',
          'Failed to load departments. Using fallback options.'
        );

        // Fallback to basic departments if API fails
        this.availableDepartments = [
          { label: 'IT', value: 'IT' },
          { label: 'HR', value: 'HR' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Marketing', value: 'Marketing' },
          { label: 'Sales', value: 'Sales' },
          { label: 'General', value: 'General' },
        ];

        if (this.debugMode)
          console.log(
            '🔄 Using fallback departments:',
            this.availableDepartments
          );
      },
    });
  }

  private loadMockUsers(): void {
    if (this.debugMode) console.log('🔧 Loading mock users data');

    this.allUsers = [
      {
        id: '1',
        username: 'john.doe',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Developer',
        department: 'IT',
        status: 'active',
        lastLogin: '2025-08-08T10:30:00',
        createdAt: '2025-08-01T09:00:00',
        updatedAt: '2025-08-01T09:00:00',
        phone: '+1234567890',
      },
      {
        id: '2',
        username: 'jane.smith',
        email: 'jane.smith@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Manager',
        department: 'HR',
        status: 'active',
        lastLogin: '2025-08-08T08:15:00',
        createdAt: '2025-07-28T14:30:00',
        updatedAt: '2025-07-28T14:30:00',
        phone: '+1234567891',
      },
      {
        id: '3',
        username: 'mike.johnson',
        email: 'mike.johnson@company.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'Analyst',
        department: 'Finance',
        status: 'inactive',
        lastLogin: 'Never',
        createdAt: '2025-08-07T16:45:00',
        updatedAt: '2025-08-07T16:45:00',
        phone: '+1234567892',
      },
      {
        id: '4',
        username: 'sarah.wilson',
        email: 'sarah.wilson@company.com',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        lastLogin: '2025-08-07T15:20:00',
        createdAt: '2025-07-15T11:00:00',
        updatedAt: '2025-07-15T11:00:00',
        phone: '+1234567893',
      },
      {
        id: '5',
        username: 'david.brown',
        email: 'david.brown@company.com',
        firstName: 'David',
        lastName: 'Brown',
        role: 'Admin',
        department: 'IT',
        status: 'active',
        lastLogin: '2025-08-08T09:45:00',
        createdAt: '2025-06-20T10:30:00',
        updatedAt: '2025-06-20T10:30:00',
        phone: '+1234567894',
      },
      {
        id: '6',
        username: 'lisa.garcia',
        email: 'lisa.garcia@company.com',
        firstName: 'Lisa',
        lastName: 'Garcia',
        role: 'Sales Rep',
        department: 'Sales',
        status: 'inactive',
        lastLogin: '2025-08-01T14:30:00',
        createdAt: '2025-07-10T08:15:00',
        updatedAt: '2025-07-10T08:15:00',
        phone: '+1234567895',
      },
      {
        id: '7',
        username: 'robert.davis',
        email: 'robert.davis@company.com',
        firstName: 'Robert',
        lastName: 'Davis',
        role: 'QA Engineer',
        department: 'IT',
        status: 'active',
        lastLogin: '2025-08-08T11:00:00',
        createdAt: '2025-07-25T13:45:00',
        updatedAt: '2025-07-25T13:45:00',
        phone: '+1234567896',
      },
      {
        id: '8',
        username: 'emily.martinez',
        email: 'emily.martinez@company.com',
        firstName: 'Emily',
        lastName: 'Martinez',
        role: 'Accountant',
        department: 'Finance',
        status: 'inactive',
        lastLogin: 'Never',
        createdAt: '2025-08-06T16:20:00',
        updatedAt: '2025-08-06T16:20:00',
        phone: '+1234567897',
      },
    ];

    this.filteredUsers = [...this.allUsers];
    console.log('✅ Mock users data loaded');
  }

  fetchUsers(): void {
    if (this.debugMode) console.log('🔧 Fetching users data...');

    this.isLoading = true;
    this.error = null;

    // Use the configured API endpoint
    this.http.get<ApiUser[]>(environment.getUsers).subscribe({
      next: (data) => {
        if (this.debugMode) console.log('✅ Users Data received:', data);
        this.allUsers = this.transformApiUsers(data);
        this.filteredUsers = [...this.allUsers];
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Users API Error:', error);
        this.isLoading = false;
        this.error = `API Error: ${error.status} - ${error.message}`;

        // Load mock data as fallback
        this.loadMockUsers();
      },
    });
  }

  private transformApiUsers(apiUsers: ApiUser[]): User[] {
    return apiUsers.map((apiUser) => {
      // Extract name from email if available
      const emailParts = apiUser.email.split('@')[0];
      const nameParts = emailParts.includes('.')
        ? emailParts.split('.')
        : [emailParts];

      return {
        id: apiUser.id,
        email: apiUser.email,
        role: apiUser.role,
        status: apiUser.is_active ? 'active' : 'inactive',
        createdAt: apiUser.created_at,
        updatedAt: apiUser.updated_at,
        // Derived properties
        firstName: nameParts[0] ? this.capitalizeFirst(nameParts[0]) : 'User',
        lastName: nameParts[1] ? this.capitalizeFirst(nameParts[1]) : '',
        username: emailParts,
        department: this.getRoleDepartment(apiUser.role),
        lastLogin: 'N/A', // Not provided in API
        phone: 'N/A', // Not provided in API
      };
    });
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getRoleDepartment(role: string): string {
    const departmentMap: { [key: string]: string } = {
      Developer: 'IT',
      user: 'General',
      Admin: 'IT',
      Manager: 'Management',
      Analyst: 'Analytics',
      Designer: 'Design',
      'QA Engineer': 'IT',
      'Sales Rep': 'Sales',
      Accountant: 'Finance',
    };
    return departmentMap[role] || 'General';
  }

  // Search functionality
  onSearch(): void {
    if (this.debugMode) console.log('🔧 Searching users:', this.searchTerm);

    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.allUsers];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.allUsers.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower)
    );
  }

  // User actions
  addNewUser(mode: string): void {
    if (this.debugMode) console.log('🔧 Add new user:', mode);
    this.isAddUserModalVisible = true;
    this.addUserForm.reset();
    this.addUserForm.patchValue({ status: 'active' });
  }

  showAddUserModal(): void {
    this.isAddUserModalVisible = true;
    this.addUserForm.reset();
    this.addUserForm.patchValue({ status: 'active' });
  }

  hideAddUserModal(): void {
    this.isAddUserModalVisible = false;
    this.addUserForm.reset();
  }

  submitAddUser(): void {
    if (this.addUserForm.valid) {
      this.modalLoading = true;
      const formData = this.addUserForm.value;

      // Generate ID for new user (in real app, this would come from API)
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        role: formData.role,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email.split('@')[0],
        department: formData.department,
        lastLogin: 'Never',
        phone: formData.phone || 'N/A',
      };

      // In real application, make API call here
      setTimeout(() => {
        this.allUsers.push(newUser);
        this.filteredUsers = [...this.allUsers];
        this.modalLoading = false;
        this.hideAddUserModal();
        console.log('✅ User added successfully:', newUser);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.addUserForm.controls).forEach((key) => {
        this.addUserForm.get(key)?.markAsTouched();
      });
    }
  }

  viewUser(user: User): void {
    if (this.debugMode) console.log('🔧 View user:', user);

    this.selectedUser = user;
    this.fetchUserDetails(user.id);
  }

  fetchUserDetails(userId: string): void {
    if (this.debugMode) console.log('🔧 Fetching user details for:', userId);

    this.modalLoading = true;
    const userDetailsUrl = `${environment.getUserDetailsById}${userId}`;

    this.http.get<ApiUser>(userDetailsUrl).subscribe({
      next: (userDetails) => {
        if (this.debugMode)
          console.log('✅ User details received:', userDetails);

        this.selectedUserDetails = userDetails;

        // Populate the view form with user details
        this.viewUserForm.patchValue({
          email: userDetails.email,
          role: userDetails.role,
          is_active: userDetails.is_active,
          password: '', // Don't populate password for security
        });

        this.modalLoading = false;
        this.isViewUserModalVisible = true;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Fetch user details API Error:', error);
        this.modalLoading = false;

        this.notification.error(
          'Error',
          `Failed to fetch user details: ${error.status} - ${error.message}`
        );
      },
    });
  }

  editUser(user: User, mode: string): void {
    if (this.debugMode) console.log('🔧 Edit user:', user, mode);
    this.selectedUser = user;
    this.isEditUserModalVisible = true;

    // Populate edit form with user data
    this.editUserForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      status: user.status,
    });
  }

  hideEditUserModal(): void {
    this.isEditUserModalVisible = false;
    this.selectedUser = null;
    this.editUserForm.reset();
  }

  hideViewUserModal(): void {
    this.isViewUserModalVisible = false;
    this.selectedUser = null;
    this.selectedUserDetails = null;
    this.viewUserForm.reset();
  }

  submitUpdateUser(): void {
    if (this.viewUserForm.valid && this.selectedUserDetails) {
      this.modalLoading = true;

      const formData = this.viewUserForm.value;
      const updateData: UpdateUserRequest = {
        email: formData.email,
        is_active: formData.is_active,
        role: formData.role,
      };

      // Only include password if it's provided
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password;
      }

      const updateUrl = `${environment.updateUser}${this.selectedUserDetails.id}`;

      this.http.put<ApiUser>(updateUrl, updateData).subscribe({
        next: (updatedUser) => {
          if (this.debugMode)
            console.log('✅ User updated successfully:', updatedUser);

          // Update the user in the local arrays
          const userIndex = this.allUsers.findIndex(
            (u) => u.id === updatedUser.id
          );
          if (userIndex !== -1) {
            this.allUsers[userIndex] = this.transformApiUsers([updatedUser])[0];
          }

          const filteredIndex = this.filteredUsers.findIndex(
            (u) => u.id === updatedUser.id
          );
          if (filteredIndex !== -1) {
            this.filteredUsers[filteredIndex] = this.transformApiUsers([
              updatedUser,
            ])[0];
          }

          this.modalLoading = false;
          this.hideViewUserModal();

          this.notification.success('Success', 'User updated successfully!');
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Update user API Error:', error);
          this.modalLoading = false;

          this.notification.error(
            'Error',
            `Failed to update user: ${error.status} - ${error.message}`
          );
        },
      });
    } else {
      this.notification.warning(
        'Validation Error',
        'Please fill in all required fields correctly.'
      );
    }
  }

  submitEditUser(): void {
    if (this.editUserForm.valid && this.selectedUser) {
      this.modalLoading = true;
      const formData = this.editUserForm.value;

      // Update user data
      const userIndex = this.allUsers.findIndex(
        (u) => u.id === this.selectedUser!.id
      );
      if (userIndex !== -1) {
        this.allUsers[userIndex] = {
          ...this.allUsers[userIndex],
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          phone: formData.phone || 'N/A',
          status: formData.status,
          updatedAt: new Date().toISOString(),
          username: formData.email.split('@')[0],
        };

        this.filteredUsers = [...this.allUsers];
      }

      // In real application, make API call here
      setTimeout(() => {
        this.modalLoading = false;
        this.hideEditUserModal();
        console.log('✅ User updated successfully');
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.editUserForm.controls).forEach((key) => {
        this.editUserForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteUser(userId: string): void {
    if (this.debugMode) console.log('🔧 Delete user:', userId);

    const user = this.allUsers.find((u) => u.id === userId);
    if (!user) {
      this.notification.error('Error', 'User not found');
      return;
    }

    this.modal.confirm({
      nzTitle: 'Confirm Delete',
      nzContent: `Are you sure you want to delete <strong>${
        user.firstName || user.email
      }</strong>? This action cannot be undone.`,
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.performUserDeletion(userId);
      },
      nzOnCancel: () => {
        console.log('Delete cancelled');
      },
    });
  }

  private performUserDeletion(userId: string): void {
    this.isLoading = true;

    // Make API call to delete user
    const deleteUrl = `${environment.deleteUser}${userId}`;

    this.http.delete(deleteUrl).subscribe({
      next: (response) => {
        if (this.debugMode)
          console.log('✅ User deleted successfully:', response);

        // Remove user from local arrays
        this.allUsers = this.allUsers.filter((u) => u.id !== userId);
        this.filteredUsers = this.filteredUsers.filter((u) => u.id !== userId);

        this.isLoading = false;

        // Show success notification
        this.notification.success(
          'Success',
          'User has been deleted successfully',
          { nzDuration: 3000 }
        );

        console.log('✅ User deleted from UI:', userId);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Delete User API Error:', error);
        this.isLoading = false;

        // Show error notification based on status code
        let errorMessage = 'Failed to delete user';

        if (error.status === 404) {
          errorMessage = 'User not found on server';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to delete this user';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred while deleting user';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Failed to delete user: ${error.message}`;
        }

        this.notification.error('Delete Failed', errorMessage, {
          nzDuration: 5000,
        });
      },
    });
  }

  activateUser(userId: string): void {
    if (this.debugMode) console.log('🔧 Activate user:', userId);

    // Check if current user is admin
    if (!this.isCurrentUserAdmin()) {
      this.notification.error(
        'Access Denied',
        'Only administrators can activate/deactivate users.'
      );
      return;
    }

    // Find the user to activate
    const user = this.allUsers.find((u) => u.id === userId);
    if (!user) {
      this.notification.error('Error', 'User not found.');
      return;
    }

    // Prevent activation of SYSTEM ADMIN accounts
    if (user.role === 'SYSTEM ADMIN') {
      this.notification.error(
        'Access Denied',
        'System Administrator accounts cannot be activated. They are always active.'
      );
      return;
    }

    // Confirm action
    this.modal.confirm({
      nzTitle: 'Activate User',
      nzContent: `Are you sure you want to activate user "${user.email}"?`,
      nzOkText: 'Yes, Activate',
      nzCancelText: 'Cancel',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.updateUserStatus(userId, true);
      },
    });
  }

  deactivateUser(userId: string): void {
    if (this.debugMode) console.log('🔧 Deactivate user:', userId);

    // Check if current user is admin
    if (!this.isCurrentUserAdmin()) {
      this.notification.error(
        'Access Denied',
        'Only administrators can activate/deactivate users.'
      );
      return;
    }

    // Find the user to deactivate
    const user = this.allUsers.find((u) => u.id === userId);
    if (!user) {
      this.notification.error('Error', 'User not found.');
      return;
    }

    // Prevent deactivation of SYSTEM ADMIN accounts
    if (user.role === 'SYSTEM ADMIN') {
      this.notification.error(
        'Access Denied',
        'System Administrator accounts cannot be deactivated. They are always active.'
      );
      return;
    }

    // Confirm action
    this.modal.confirm({
      nzTitle: 'Deactivate User',
      nzContent: `Are you sure you want to deactivate user "${user.email}"? The user will no longer be able to access the system.`,
      nzOkText: 'Yes, Deactivate',
      nzCancelText: 'Cancel',
      nzOkDanger: true,
      nzOnOk: () => {
        this.updateUserStatus(userId, false);
      },
    });
  }

  // Helper method to update user status via API
  private updateUserStatus(userId: string, isActive: boolean): void {
    this.isLoading = true;

    // Find the user to get their current data
    const user = this.allUsers.find((u) => u.id === userId);
    if (!user) {
      this.notification.error('Error', 'User not found.');
      this.isLoading = false;
      return;
    }

    // Prepare update data
    const updateData: UpdateUserRequest = {
      email: user.email,
      is_active: isActive,
      role: user.role,
    };

    const updateUrl = `${environment.updateUser}${userId}`;

    if (this.debugMode) {
      console.log('🔧 Updating user status via API:', {
        userId,
        isActive,
        updateUrl,
        updateData,
      });
    }

    this.http.put<ApiUser>(updateUrl, updateData).subscribe({
      next: (updatedUser) => {
        if (this.debugMode)
          console.log('✅ User status updated successfully:', updatedUser);

        // Update the user in local arrays
        const userIndex = this.allUsers.findIndex(
          (u) => u.id === updatedUser.id
        );
        if (userIndex !== -1) {
          this.allUsers[userIndex] = this.transformApiUsers([updatedUser])[0];
        }

        const filteredIndex = this.filteredUsers.findIndex(
          (u) => u.id === updatedUser.id
        );
        if (filteredIndex !== -1) {
          this.filteredUsers[filteredIndex] = this.transformApiUsers([
            updatedUser,
          ])[0];
        }

        this.isLoading = false;

        // Show success notification
        const action = isActive ? 'activated' : 'deactivated';
        this.notification.success(
          'Success',
          `User has been ${action} successfully!`
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Update user status API Error:', error);
        this.isLoading = false;

        const action = isActive ? 'activate' : 'deactivate';
        this.notification.error(
          'Error',
          `Failed to ${action} user: ${error.status} - ${error.message}`
        );
      },
    });
  }

  // Helper method to get current user's email
  private getCurrentUserEmail(): string {
    return (
      this.dataService.loggedInUser?.email ||
      this.dataService.userDetails?.email ||
      ''
    );
  }

  // Helper method to get current user's role
  private getCurrentUserRole(): string {
    return (
      this.dataService.loggedInUser?.role ||
      this.dataService.userDetails?.role ||
      ''
    );
  }

  // Public method for template access - check if current user is admin
  isCurrentUserAdmin(): any {
    const currentUserEmail = this.getCurrentUserEmail();
    const currentUserRole = this.getCurrentUserRole();

    if (currentUserRole?.toLowerCase() === 'system admin') {
      this.show = true;
    } else {
      this.show = false;
    }
    // Check by email (Admin@devflow.com) or role
  }

  // Helper method to check if a user can be deactivated
  canDeactivateUser(user: User): boolean {
    // Only protect SYSTEM ADMIN users - they are always active
    if (user.role === 'SYSTEM ADMIN') {
      return false;
    }

    // All other users (including USER role) can be deactivated
    return true;
  }

  // Get appropriate tooltip for deactivate button
  getDeactivateButtonTitle(user: User): string {
    if (user.role === 'SYSTEM ADMIN') {
      return 'System Administrator accounts cannot be deactivated - they are always active';
    }

    return 'Deactivate User';
  }

  // Helper method to check if a user can be activated
  canActivateUser(user: User): boolean {
    // Only protect SYSTEM ADMIN users - they are always active
    if (user.role === 'SYSTEM ADMIN') {
      return false;
    }

    // All other users (including USER role) can be activated
    return true;
  }

  // Get appropriate tooltip for activate button
  getActivateButtonTitle(user: User): string {
    if (user.role === 'SYSTEM ADMIN') {
      return 'System Administrator accounts are always active';
    }

    return 'Activate User';
  }

  // Status helpers
  getUserStatusColor(status: string): string {
    const colors = {
      active: '#52c41a',
      inactive: '#d9d9d9',
    };
    return colors[status as keyof typeof colors] || '#d9d9d9';
  }

  getUserStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Format helpers
  formatDate(dateString: string): string {
    if (dateString === 'Never' || dateString === 'N/A' || !dateString)
      return 'Never';
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    if (dateString === 'Never' || dateString === 'N/A' || !dateString)
      return 'Never';
    return new Date(dateString).toLocaleString();
  }

  // Utility methods
  refreshUsers(): void {
    if (this.debugMode) console.log('🔧 Refreshing users');
    this.fetchUsers();
  }

  // Track by function for better performance
  trackByUser(index: number, user: User): string {
    return user.id;
  }

  // Permission checks
  hasPermission(permission: string): boolean {
    return this.dataService.hasPermission(permission);
  }

  // Form validation helpers
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
    }
    return '';
  }
}
