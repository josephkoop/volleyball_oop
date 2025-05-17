// models/UserClass.ts
import { User } from "../interfaces/UserHeader";
import bcrypt from "bcrypt";
import { query } from '../config/db';
import { createUserInstance } from "./UserFactory";

export class UserClass implements User {
    id: number;
    username: string;
    password: string;
    role: 'official' | 'admin';

    constructor({ id, username, password, role }: User) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    static async findByUsername(username: string): Promise<UserClass | null> {
        const result = await query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length === 0) return null;
        return await createUserInstance(result.rows[0]);
    }

    static async getAllExceptOverallAdmin(): Promise<UserClass[]> {
        const result = await query("SELECT id, username, password, role FROM users WHERE role != 'overall-admin'");
        const instances = await Promise.all(result.rows.map(row => createUserInstance(row)));
        return instances;
    }

    static async create(username: string, password: string, role: string = 'official'): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        await query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3)", [username, hashedPassword, role]);
    }

    static async deleteById(id: number): Promise<void> {
        await query("DELETE FROM users WHERE id = $1", [id]);
    }

    async comparePassword(plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.password);
    }

    canDeleteUsers(): boolean {
        return false;
    }
}
