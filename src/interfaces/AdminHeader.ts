// interfaces/AdminHeader.ts
import { User } from "./UserHeader";

export interface Admin extends User {
    // Future: accessLogs, manageUsers, etc.
}