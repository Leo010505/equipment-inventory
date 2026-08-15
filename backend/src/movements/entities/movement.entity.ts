import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Equipment } from '../../equipments/entities/equipment.entity';

@Entity('movements')
export class Movement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Relación: Qué equipo se está prestando/devolviendo
    @ManyToOne(() => Equipment)
    @JoinColumn({ name: 'equipmentId' })
    equipment: Equipment;

    // Relación: Qué usuario lo tiene
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Acción: CHECK_OUT (Préstamo) o RETURN (Devolución)
    @Column({ type: 'enum', enum: ['CHECK_OUT', 'RETURN'], default: 'CHECK_OUT' })
    action: string;

    // Detalles opcionales del estado en el que se entregó
    @Column({ type: 'text', nullable: true })
    notes: string;

    // La fecha exacta del movimiento
    @CreateDateColumn()
    createdAt: Date;
}