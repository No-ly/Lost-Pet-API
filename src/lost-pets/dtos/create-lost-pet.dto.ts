import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLostPetDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  lat!: number;

  @IsNumber()
  @IsNotEmpty()
  lon!: number;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  race!: string;

  @IsNumber()
  @IsNotEmpty()
  age!: number;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  ownerName!: string;
}