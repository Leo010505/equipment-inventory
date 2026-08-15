import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movement } from './entities/movement.entity';
import { Equipment } from '../equipments/entities/equipment.entity';
import { User } from '../users/entities/user.entity';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createMovementDto: CreateMovementDto) {
    const { equipmentId, userId, ...movementData } = createMovementDto;

    // 1. Validar que el equipo exista
    const equipment = await this.equipmentRepository.findOneBy({ id: equipmentId });
    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${equipmentId} no encontrado`);
    }

    // 2. Validar que el usuario exista
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // 3. Crear el registro del movimiento
    const movement = this.movementRepository.create({
      ...movementData,
      equipment,
      user,
    });

    // BONUS OPCIONAL: Si quieres que el equipo cambie de estado automáticamente:
    // equipment.status = movementData.action === 'CHECK_OUT' ? 'IN_USE' : 'AVAILABLE';
    // await this.equipmentRepository.save(equipment);

    return await this.movementRepository.save(movement);
  }

  async findAll() {
    return await this.movementRepository.find({
      relations: {
        equipment: true,
        user: true, // Trae los datos del equipo y del usuario que hizo el movimiento
      },
      order: {
        createdAt: 'DESC', // Ordena para mostrar los más recientes primero
      },
    });
  }

  async findOne(id: string) {
    const movement = await this.movementRepository.findOne({
      where: { id },
      relations: {
        equipment: true,
        user: true,
      },
    });
    if (!movement) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    return movement;
  }
}