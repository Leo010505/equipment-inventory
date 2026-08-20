import type { Category } from './category';

export interface Equipment {
    id: string;
    name: string;
    description: string;
    serialNumber: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED';
    categoryId?: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

export type CreateEquipmentDTO = Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'category'> & {
    categoryId: string;
};