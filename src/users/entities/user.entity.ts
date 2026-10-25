import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { Point } from 'geojson';

@Entity('SYSTEM_USER')
export class User{
    //id, name, lastName, email, password, isPetAlertEnabled, location, radius (numero)
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string;
    @Column()
    lastName!: string;
    @Column()
    email!: string;
    @Column()
    password!: string;
    @Column()
    isPetAlertEnabled!: boolean;
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326
    })
    location?: Point
    @Column()
    radius!: number
}