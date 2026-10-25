import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CreateLostPetDto } from './dtos/lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '../cache/cache.service';
// PATRON REPOSITORY
//SQL / Redis: Clave-valor / Investigar: ElasticSearch es NoSQL, es un motor de búsqueda

const LOST_PET_ALL_CACHE_KEY = "lost-pets:all"
@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private lostPetRepository : Repository<LostPet>,
        private cacheService: CacheService
    ){}

    //Typos
    async getAllPets() : Promise<LostPet[]>{
        const cached = await this.cacheService.get<LostPet[]>(LOST_PET_ALL_CACHE_KEY)
        if(cached) return cached;
                                    //MAGIC STRING
        const lostPets = await this.lostPetRepository.find();
        await this.cacheService.set(LOST_PET_ALL_CACHE_KEY, lostPets)

        return lostPets;
    }

    async createLostPet(dto:CreateLostPetDto,image:string) : Promise<LostPet> {
        const newLostPet = this.lostPetRepository.create({
            type: dto.type,
            name: dto.name,
            phone: dto.phone,
            race: dto.race,
            age: dto.age,
            color: dto.color,
            ownerName: dto.ownerName,
            image: image,
            location: {
                type: 'Point',
                coordinates:[dto.lon,dto.lat]
            }
        });
        const lostPet = await this.lostPetRepository.save(newLostPet)
        await this.cacheService.delete(LOST_PET_ALL_CACHE_KEY);
        return lostPet;
    }
}
