import { IsString, IsNumber } from 'class-validator';

export class CreatePlatoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsString()
  descripcion: string;
}
