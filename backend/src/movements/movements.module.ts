import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { Equipment } from '../equipments/entities/equipment.entity';
import { User } from '../users/entities/user.entity'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [TypeOrmModule.forFeature([Movement, Equipment, User])],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule { }