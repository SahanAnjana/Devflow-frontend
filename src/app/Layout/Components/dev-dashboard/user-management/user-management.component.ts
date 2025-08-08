import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/_services/shared-data/data.service';
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
  availableRoles = [
    'Developer',
    'Manager',
    'Analyst',
    'Designer',
    'Admin',
    'QA Engineer',
    'Sales Rep',
    'Accountant',
    'user',
  ];
  availableDepartments = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'General',
    'Management',
    'Analytics',
    'Design',
  ];

  // Component lifecycle
  private componentDestroyed = false;

  constructor(
    private http: HttpClient,
    public dataService: DataService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalService
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
      this.fetchUsers();
    } catch (error) {
      console.error('❌ Error in User Management ngOnInit:', error);
      this.error = 'Error initializing User Management';
    }
  }

  ngOnDestroy(): void {
    if (this.debugMode) console.log('🔧 User Management ngOnDestroy called');
    this.componentDestroyed = true;
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

    const user = this.allUsers.find((u) => u.id === userId);
    if (user) {
      user.status = 'active';
      console.log('User activated:', userId);
    }
  }

  deactivateUser(userId: string): void {
    if (this.debugMode) console.log('🔧 Deactivate user:', userId);

    const user = this.allUsers.find((u) => u.id === userId);
    if (user) {
      user.status = 'inactive';
      console.log('User deactivated:', userId);
    }
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
