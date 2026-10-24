import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn,
  Index // <-- 1. No olvides importar Index
} from 'typeorm'; 
import type { Point } from 'geojson'; // Excelente uso de 'import type'

@Entity('LOST_PET') 
export class LostPet { 
  @PrimaryGeneratedColumn('uuid') 
  id!: string; 

  @Column({ type: 'varchar', length: 100 }) 
  type!: string; 

  @Column({ type: 'varchar', length: 100 }) 
  name!: string; 

  // <-- 2. Aquí está el índice espacial crítico para PostGIS
  @Index({ spatial: true })
  @Column({ 
    type: 'geometry', 
    spatialFeatureType: 'Point', 
    srid: 4326, 
  }) 
  location!: Point; 

  @Column({ type: 'varchar', length: 20 }) 
  phone!: string; 

  @Column({ type: 'varchar', length: 100 }) 
  race!: string; 

  @Column({ type: 'int' }) 
  age!: number; 

  @Column({ type: 'varchar', length: 50 }) 
  color!: string; 

  @Column({ type: 'varchar', length: 150 }) 
  ownerName!: string; 

  @CreateDateColumn() 
  createdAt!: Date; 

  @UpdateDateColumn() 
  updatedAt!: Date; 
}