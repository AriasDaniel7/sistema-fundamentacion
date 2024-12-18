export interface CreateUserProjectRole {
  projectId: string;
  userId: string;
  roleId: string;
}

export interface CreateUserProjectRoleResponse {
  user: User;
  project: Project;
  role: Role;
  id: string;
}

export interface User {
  id: string;
}

export interface Project {
  id: string;
}

export interface Role {
  id: string;
}
