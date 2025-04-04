import { UserRole } from "../../users/user-role.enum";

export interface JwtPayload {
    id: number;
    email: string;
    role: UserRole;
    // другие поля, которые вы храните в JWT токене
  }