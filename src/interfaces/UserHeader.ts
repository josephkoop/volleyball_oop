// interfaces/UserHeader.ts

export interface User {
    id: number;
    username: string;
    password: string;
    role: 'official' | 'admin';

    comparePassword(plainPassword: string): Promise<boolean>;
    canDeleteUsers(): boolean;
}