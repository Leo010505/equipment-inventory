import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { MovementsModule } from './movements/movements.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'equipment_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    CategoriesModule,
    EquipmentsModule,
    MovementsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }