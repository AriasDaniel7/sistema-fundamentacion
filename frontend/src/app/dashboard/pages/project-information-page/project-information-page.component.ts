import { CommonModule } from '@angular/common';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  UserByProjectResponse,
  UserResponse,
} from '../../interfaces/user-response.interface';
import { firstValueFrom, map, of, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RoleResponse } from '../../interfaces/role-response.interface';
import {
  ProjectResponse,
  ProjectResponseInformation,
} from '../../interfaces/project-response.interface';
import { IaService } from '../../services/ia.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project-information-page',
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './project-information-page.component.html',
  styleUrl: './project-information-page.component.scss',
})
export class ProjectInformationPageComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private iaService = inject(IaService);

  public projectForm: FormGroup;
  public users: UserResponse[] = [];
  public roles: RoleResponse[] = [];
  public filtersUsers: UserResponse[] = [];
  public selectedUsers: UserResponse[] = [];

  public currentId?: string;
  public currentUser?: UserResponse;
  public currentProject?: ProjectResponseInformation;
  public isLoading = false;

  messages = [
    {
      user: 'Asistente Personal',
      text: '¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ];
  newMessage = '';
  isChatboxVisible = false;

  toggleChatbox() {
    this.isChatboxVisible = !this.isChatboxVisible;
  }

  private convertToHtml(text: string): string {
    // Convert **text** to <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert lists
    text = text.replace(/(?:^|\n)\* (.*?)(?=\n|$)/g, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    // Convert new lines to <br> except within <ul> and <li>
    text = text.replace(/<\/ul><br>/g, '</ul>');
    text = text.replace(/<br><ul>/g, '<ul>');

    // Wrap text in <p> tags, but avoid wrapping <ul> and <li> tags
    text = text
      .split('\n')
      .map((line) => {
        if (
          !line.startsWith('<ul>') &&
          !line.startsWith('<li>') &&
          !line.startsWith('</ul>')
        ) {
          return `<p>${line}</p>`;
        }
        return line;
      })
      .join('');

    return text;
  }

  async sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        user: this.currentUser?.userName!, // Replace with actual current user
        text: this.newMessage,
        timestamp: new Date(),
      });

      this.isLoading = true;
      
      this.iaService.sendMessage(this.newMessage).subscribe((data) => {
        this.isLoading = false;
        const response = this.convertToHtml(
          data.response.candidates[0].content.parts[0].text
        );

        this.messages.push({
          user: 'Asistente Personal',
          text: response,
          timestamp: new Date(),
        });
      });

      this.newMessage = '';
    }
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
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
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.projectService.getProjectById(id)),
        switchMap((project) => {
          if (!project) {
            this.router.navigate(['/panel/projects']);
            return of(null);
          }

          return this.iaService.initChat(project.name, project.description);
        })
      )
      .subscribe((res) => {
        console.log(res);
      });

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.projectService.getProjectById(id)),
        switchMap((project) => {
          if (!project) {
            this.router.navigate(['/panel/projects']);
            return of(null);
          }

          this.currentProject = project;

          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
          });

          this.selectedUsers = project.userProjectRoles
            .map((userProjectRole) => {
              const user = userProjectRole.user;
              user.selectedRole = userProjectRole.role;
              return user;
            })
            .filter((user) => user.id !== this.currentId);

          this.selectedUsers.forEach((user) => this.selection.select(user));
          this.filtersUsers = this.selectedUsers;
          this.dataSource.data = this.filtersUsers;

          return this.projectService.getUserByIDAndProjectID(
            this.currentId!,
            this.currentProject.id
          );
        })
      )
      .subscribe((user) => {
        if (user) {
          this.currentUser = user.user;
          this.currentUser.selectedRole = user.role;
        }
      });

    this.userService.getUsers().subscribe((users) => {
      this.users = users.filter((user) => user.id !== this.currentId);
      this.users.forEach((user) => {
        if (!user.selectedRole) {
          user.selectedRole = this.roles.find((role) => role.name === 'USER');
        }
      });
    });

    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  async onSubmit() {}

  search(term: string) {
    if (term) {
      const filteredUsers = this.users.filter((user) =>
        user.userName.toLowerCase().includes(term.trim().toLowerCase())
      );

      const selectedUserIds = new Set(
        this.selection.selected.map((user) => user.id)
      );

      this.filtersUsers = filteredUsers.map((user) => {
        const selectedUser = this.selection.selected.find(
          (selected) => selected.id === user.id
        );

        if (selectedUser) {
          // Mantener el rol existente del usuario seleccionado
          user.selectedRole = selectedUser.selectedRole;
          this.selection.select(user);
        }

        return user;
      });

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

      const selectedUser = this.selectedUsers.find((u) => u.id === user.id);
      if (selectedUser) {
        selectedUser.selectedRole = selectedRole;
      }
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
