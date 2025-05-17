// models/OfficialUser.ts
import { Official } from "../interfaces/OfficialHeader";
import { UserClass } from "./UserClass";

export class OfficialUser extends UserClass implements Official {
    canDeleteUsers(): boolean {
        return false;
    }
}