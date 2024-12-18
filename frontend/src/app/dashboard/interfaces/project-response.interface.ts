import { UserResponse } from './user-response.interface';

export interface ProjectResponse {
  id: string;
  project: Project;
  role: Role;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface ProjectResponseInformation {
  id: string;
  name: string;
  description: string;
  userProjectRoles: UserProjectRole[];
}

export interface UserProjectRole {
  id: string;
  user: UserResponse;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
}
