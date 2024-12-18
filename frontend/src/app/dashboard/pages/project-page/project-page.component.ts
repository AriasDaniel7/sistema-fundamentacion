import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../interfaces/user-response.interface';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RoleService } from '../../services/role.service';
import { RoleResponse } from '../../interfaces/role-response.interface';
import { ProjectService } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'dashboard-project-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    CommonModule,
    MatChipsModule,
    MatSelectModule,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  public projectForm: FormGroup;
  public users: UserResponse[] = [];
  public roles: RoleResponse[] = [];
  public filtersUsers: UserResponse[] = [];
  public selectedUsers: UserResponse[] = [];

  public currentId?: string;
  public currentUser?: UserResponse;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.currentId = this.authService.currentId();
    this.projectForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.minLength(3),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  displayedColumns: string[] = [
    'select',
    'userName',
    'fullName',
    'email',
    'role',
  ];

  dataSource = new MatTableDataSource<UserResponse>(this.filtersUsers);
  selection = new SelectionModel<UserResponse>(true, []);

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users.filter((user) => user.id !== this.currentId);
      this.currentUser = users.find((user) => user.id === this.currentId);
      this.users.forEach((user) => {
        user.selectedRole = this.roles.find((role) => role.name === 'USER');
      });
    });

    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
      if (this.currentUser) {
        this.currentUser.selectedRole = roles.find(
          (role) => role.name === 'ADMIN'
        );
      }
    });
  }

  async onSubmit() {
    if (this.projectForm.valid) {
      const { name, description } = this.projectForm.value;

      this.projectService.createProject({ name, description }).subscribe({
        next: async (project) => {
          const usersSelected = [...this.selectedUsers];
          usersSelected.push(this.currentUser!);

          const userProjectRolesPromises = usersSelected.map(async (user) => {
            const roleId = user.selectedRole!.id;
            const projectId = project.id;
            const userId = user.id;

            const userProjectRole = await firstValueFrom(
              this.projectService.createAssignationUserRole({
                projectId,
                userId,
                roleId,
              })
            );
            return userProjectRole;
          });

          await Promise.all(userProjectRolesPromises);

          this.snackBar.open('Proyecto creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          this.projectForm.reset();
          this.selectedUsers = [];
          this.selection.clear();
          this.filtersUsers = [];
          this.dataSource.data = [];
        },
        error: (err) => {
          this.snackBar.open(err, 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
      });
    }
  }

  search(term: string) {
    if (term) {
      this.filtersUsers = this.users.filter((user) =>
        user.userName.toLowerCase().includes(term.trim().toLowerCase())
      );
      this.dataSource.data = this.filtersUsers;
    } else {
      this.filtersUsers = [];
      this.dataSource.data = [];
    }
  }

  onRoleChange(event: MatSelectChange, user: UserResponse) {
    const selectedRole = this.roles.find((role) => role.name === event.value);
    if (selectedRole) {
      user.selectedRole = selectedRole;
    }
  }

  onCheckboxChange(event: MatCheckboxChange, user: UserResponse) {
    if (event.checked) {
      this.selection.select(user);
      this.selectedUsers = this.selection.selected;
      this.changeSelectedRoleDefault(this.selectedUsers);
    } else {
      this.selection.deselect(user);
      this.selectedUsers = this.selection.selected;
      this.changeSelectedRoleDefault(this.selectedUsers);
    }
  }

  toggleRow(row: UserResponse) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);
    }
    this.selectedUsers = this.selection.selected;
    this.changeSelectedRoleDefault(this.selectedUsers);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedUsers = this.selection.selected;
      this.changeSelectedRoleDefault(this.selectedUsers);
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.selectedUsers = this.selection.selected;
    this.changeSelectedRoleDefault(this.selectedUsers);
  }

  remove(selectUser: UserResponse) {
    this.selectedUsers = this.selectedUsers.filter(
      (user) => user.id !== selectUser.id
    );

    this.selection.deselect(selectUser);
    this.selectedUsers = this.selection.selected;
  }

  private changeSelectedRoleDefault(selectedUsers: UserResponse[]) {
    selectedUsers.map((user) => {
      if (!user.selectedRole) {
        user.selectedRole = this.roles.find((role) => role.name === 'USER');
      }
      return user;
    });
  }

  checkboxLabel(row?: UserResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }
}
