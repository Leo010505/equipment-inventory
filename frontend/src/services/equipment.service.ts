import { apiFetch } from './api';
import type { Equipment, CreateEquipmentDTO } from '../types/equipment';

export const getEquipments = async (): Promise<Equipment[]> => {
    return await apiFetch('/equipments');
};

export const createEquipment = async (equipmentData: CreateEquipmentDTO): Promise<Equipment> => {
    return await apiFetch('/equipments', {
        method: 'POST',
        body: JSON.stringify(equipmentData),
    });
};

export const updateEquipment = async (id: string, equipmentData: Partial<CreateEquipmentDTO>): Promise<Equipment> => {
    return await apiFetch(`/equipments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(equipmentData),
    });
};

export const deleteEquipment = async (id: string): Promise<void> => {
    return await apiFetch(`/equipments/${id}`, {
        method: 'DELETE',
    });
};