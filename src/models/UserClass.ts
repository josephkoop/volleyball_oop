//UserClass.ts

import { User } from "../interfaces/UserHeader";
import bcrypt from "bcrypt";
import { query } from '../config/db';

export class UserClass {
    id?: number;
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
        return new UserClass(result.rows[0]);
    }

    static async create(username: string, password: string, role: string = 'user'): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        await query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
            [username, hashedPassword, role]
        );
    }

    static async getAllExceptOverallAdmin(): Promise<UserClass[]> {
        const result = await query("SELECT id, username, role FROM users WHERE role != 'overall-admin'");
        return result.rows.map((row: any) => new UserClass(row));
    }

    static async deleteById(id: number): Promise<void> {
        await query("DELETE FROM users WHERE id = $1", [id]);
    }

    async comparePassword(plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.password);
    }
}