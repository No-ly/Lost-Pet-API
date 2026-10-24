import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dtos/create-lost-pet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createLostPet(@Body() createLostPetDto: CreateLostPetDto) {
    return this.lostPetsService.create(createLostPetDto);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius?: number,
  ) {
    return this.lostPetsService.findNearby(
      Number(lat), 
      Number(lon), 
      radius ? Number(radius) : 5,
    );
  }
}