import { Injectable, InternalServerErrorException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { LostPet } from './entities/lost-pet.entity'; 
import { CreateLostPetDto } from './dtos/create-lost-pet.dto'; 
import { EmailService } from '../email/email.service'; // Ajustado a ruta relativa si da problemas
import { generateLostPetTemplate } from './templates/lost-pet.template';

@Injectable() 
export class LostPetsService { 
  constructor( 
    // 1. Faltaba el genérico <LostPet>
    @InjectRepository(LostPet) 
    private readonly lostPetRepository: Repository<LostPet>,
    
    // 2. Faltaba inyectar el servicio de correos
    private readonly emailService: EmailService,
  ) {}

  // 3. Método para integrar la base de datos con el template HTML
  async create(createLostPetDto: CreateLostPetDto): Promise<LostPet> {
    try {
      // Mapear latitud y longitud al formato GeoJSON Point que espera PostGIS
      const petToSave = this.lostPetRepository.create({
        ...createLostPetDto,
        location: {
          type: 'Point',
          coordinates: [createLostPetDto.lon, createLostPetDto.lat], // GeoJSON siempre usa [longitud, latitud]
        },
      });

      // Guardar en PostgreSQL
      const savedPet = await this.lostPetRepository.save(petToSave);

      // Generar el HTML seguro con el template
      const htmlContent = generateLostPetTemplate(createLostPetDto);

      // Enviar el correo de alerta
      await this.emailService.sendMail({
        to: 'comunidad@petradar.com', // Aquí iría la lógica de usuarios a X km
        subject: `🚨 Alerta de Mascota Perdida: ${savedPet.name}`,
        html: htmlContent,
      });

      return savedPet;
      
    } catch (error) {
      console.error('Error reportando mascota perdida:', error);
      throw new InternalServerErrorException('No se pudo registrar la mascota perdida');
    }
  }

  async findNearby(lat: number, lon: number, radiusInKm: number = 5) {
    const radiusInMeters = radiusInKm * 1000; // Convertimos kilómetros a metros
    
    return await this.lostPetRepository
      .createQueryBuilder('pet')
      .where(
        'ST_DWithin(pet.location::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)',
        { 
          lon, 
          lat, 
          radius: radiusInMeters, 
        }
      )
      .getMany();
  }
}