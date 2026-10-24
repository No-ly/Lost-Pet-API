import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  Index // 1. Agregamos el import del índice
} from 'typeorm'; 
import type { Point } from 'geojson'; 

@Entity('SYSTEM_USER') 
export class User { 
  @PrimaryGeneratedColumn('uuid') 
  id!: string; 

  @Column({ type: 'varchar', length: 100 }) 
  name!: string; 

  @Column({ type: 'varchar', length: 100 }) 
  lastName!: string; 

  @Column({ type: 'varchar', length: 150, unique: true }) 
  email!: string; 

  @Column({ type: 'varchar', length: 255 }) 
  password!: string; 

  @Column({ type: 'boolean', default: true }) 
  isPetAlertEnabled!: boolean; 

  // 2. CORRECCIÓN: Índice GiST para que las búsquedas por radio sean instantáneas
  @Index({ spatial: true })
  @Column({ 
    type: 'geometry', 
    spatialFeatureType: 'Point', 
    srid: 4326, 
    nullable: true, 
  }) 
  location!: Point; 

  @Column({ type: 'int', default: 5 }) 
  radius!: number; 
}