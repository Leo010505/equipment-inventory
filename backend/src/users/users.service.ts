import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (userExists) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si viene una contraseña nueva, la encriptamos antes de actualizar
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id });

    const { password, ...userWithoutPassword } = updatedUser!;
    return userWithoutPassword;
  }

  async remove(id: string) {
    const user = await this.findOne(id); // Lanza NotFoundException si no existe
    await this.userRepository.delete(id);
    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}