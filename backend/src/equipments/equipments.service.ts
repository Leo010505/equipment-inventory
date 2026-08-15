import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createEquipmentDto: CreateEquipmentDto) {
    const { categoryId, ...equipmentData } = createEquipmentDto;

    // Buscamos la categoría por su ID (UUID)
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
    }

    const equipment = this.equipmentRepository.create({
      ...equipmentData,
      category, // Asignamos el objeto categoría completo a la relación
    });

    return await this.equipmentRepository.save(equipment);
  }

  async findAll() {
    return await this.equipmentRepository.find({
      relations: {
        category: true, // Sintaxis de objeto segura para el tipado estricto
      },
    });
  }

  async findOne(id: string) {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
    return equipment;
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto) {
    const { categoryId, ...equipmentData } = updateEquipmentDto;
    const equipment = await this.findOne(id);

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new NotFoundException(`Categoría con ID ${categoryId} no encontrada`);
      }
      equipment.category = category;
    }

    this.equipmentRepository.merge(equipment, equipmentData);
    return await this.equipmentRepository.save(equipment);
  }

  async remove(id: string) {
    const equipment = await this.findOne(id);
    return await this.equipmentRepository.remove(equipment);
  }
}