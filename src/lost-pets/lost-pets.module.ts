import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { LostPetsController } from './lost-pets.controller'; 
import { LostPetsService } from './lost-pets.service'; 
import { LostPet } from './entities/lost-pet.entity'; 
import { AuthModule } from '../auth/auth.module';

// CORRECCIÓN: Cambiado de 'src/email/email.module' a ruta relativa
import { EmailModule } from '../email/email.module'; 

@Module({ 
  imports: [ 
    TypeOrmModule.forFeature([LostPet]), // Registra el repositorio de LostPet 
    EmailModule, // Permite inyectar EmailService en LostPetsService
    AuthModule,
  ], 
  controllers: [LostPetsController], 
  providers: [LostPetsService], 
}) 
export class LostPetsModule {}