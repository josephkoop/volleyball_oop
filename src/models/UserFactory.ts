// models/UserFactory.ts
import { User } from "../interfaces/UserHeader";
import { UserClass } from "./UserClass";

export async function createUserInstance(user: User): Promise<UserClass> {
    switch (user.role) {
        case 'admin':
            const { AdminUser } = await import('./AdminUser');
            return new AdminUser(user);
        case 'official':
        default:
            const { OfficialUser } = await import('./OfficialUser');
            return new OfficialUser(user);
    }
}