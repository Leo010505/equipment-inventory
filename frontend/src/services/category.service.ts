import { apiFetch } from './api';
import type { Category, CreateCategoryDTO } from '../types/category';

export const getCategories = async (): Promise<Category[]> => {
    return await apiFetch('/categories');
};

export const createCategory = async (categoryData: CreateCategoryDTO): Promise<Category> => {
    return await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
    });
};

export const updateCategory = async (id: string, categoryData: Partial<CreateCategoryDTO>): Promise<Category> => {
    return await apiFetch(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(categoryData),
    });
};

export const deleteCategory = async (id: string): Promise<void> => {
    return await apiFetch(`/categories/${id}`, {
        method: 'DELETE',
    });
};