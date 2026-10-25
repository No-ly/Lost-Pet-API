import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { LostPetsService } from './lost-pets.service';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '../cache/cache.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([
      LostPet
    ]),
    AuthModule,
    CacheModule,
    StorageModule
  ],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
