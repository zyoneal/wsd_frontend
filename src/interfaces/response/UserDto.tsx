import {RoleDto} from './RoleDto';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: RoleDto[];
}
