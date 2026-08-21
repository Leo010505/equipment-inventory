export interface User {
    id: string;
    name: string;
    email: string;
    role?: 'ADMIN' | 'USER';
    createdAt?: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password?: string;
    role?: 'ADMIN' | 'USER';
}