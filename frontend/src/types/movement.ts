import type { Equipment } from './equipment';

export type MovementAction = 'CHECK_OUT' | 'RETURN';

export interface Movement {
    id: string;
    action: MovementAction;
    notes?: string;
    createdAt: string;
    equipment: Equipment;
    user?: {
        id: string;
        name?: string;
        email?: string;
        role?: string;
    };
}

export interface CreateMovementDTO {
    equipmentId: string;
    userId: string;
    action: MovementAction;
    notes?: string;
}