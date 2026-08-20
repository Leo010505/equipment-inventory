import { apiFetch } from './api';
import type { User, CreateUserDTO } from '../types/user';

export const getUsers = async (): Promise<User[]> => {
    return await apiFetch('/users');
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
    return await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = async (id: string): Promise<void> => {
    return await apiFetch(`/users/${id}`, {
        method: 'DELETE',
    });
};