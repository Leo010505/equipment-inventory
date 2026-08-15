import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('equipments')
export class Equipment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // Un número de serie único es vital para un laboratorio
    @Column({ type: 'varchar', unique: true })
    serialNumber: string;

    // El estado actual del equipo
    @Column({ type: 'enum', enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE'], default: 'AVAILABLE' })
    status: string;

    // Relación: Muchos equipos pueden pertenecer a una misma categoría
    @ManyToOne(() => Category)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}