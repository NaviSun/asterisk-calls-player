import { PremissionType } from "../premission.type";
import { UserRole } from "./../../users/enums/user-role.enum";

export interface ActiveUserData {
    sub: number;
    email: string;
    role: UserRole;
    firstName: string;
    premission: PremissionType[];
    // другие поля, которые вы храните в JWT токене
  }