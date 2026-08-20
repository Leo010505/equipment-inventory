import { apiFetch } from './api';
import type { Movement, CreateMovementDTO } from '../types/movement';

export const getMovements = async (): Promise<Movement[]> => {
    return await apiFetch('/movements');
};

export const createMovement = async (movementData: CreateMovementDTO): Promise<Movement> => {
    return await apiFetch('/movements', {
        method: 'POST',
        body: JSON.stringify(movementData),
    });
};