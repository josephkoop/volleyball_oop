// models/AdminUser.ts
import { Admin } from "../interfaces/AdminHeader";
import { UserClass } from "./UserClass";

export class AdminUser extends UserClass implements Admin {
    canDeleteUsers(): boolean {
        return true;
    }
}