import { RoleResponse } from './role-response.interface';

export interface UserResponse {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phone: number;
  selectedRole?: RoleResponse;
}

export interface UserByProjectResponse {
  id: string;
  user: UserResponse;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
}
