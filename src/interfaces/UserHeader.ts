//UserHeader.ts

export interface User {
    id: number;
    username: string;
    password: string;
    role: 'official' | 'admin';

    comparePassword(plainPassword: string): boolean;
}