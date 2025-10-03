import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { Plato } from './entities/plato.entity';

@Injectable()
export class PlatosService {
  private platos: Plato[] = [];
  private idCounter = 1;

  create(createPlatoDto: CreatePlatoDto): Plato {
    if (this.platos.some((p) => p.nombre === createPlatoDto.nombre)) {
      throw new BadRequestException('Ya existe un plato con ese nombre');
    }

    const nuevoPlato: Plato = {
      id: this.idCounter++,
      nombre: createPlatoDto.nombre,
      precio: createPlatoDto.precio,
      descripcion: createPlatoDto.descripcion,
    };

    this.platos.push(nuevoPlato);

    return { ...nuevoPlato };
  }

  findAll(): Plato[] {
    return [...this.platos];
  }

  findOne(id: number): Plato | undefined {
    return this.platos.find((p) => p.id === id);
  }

  update(id: number, updatePlatoDto: UpdatePlatoDto): Plato {
    const plato = this.platos.find((p) => p.id === id);

    if (!plato) {
      throw new NotFoundException(`No se encontró un plato con id ${id}`);
    }
    if (updatePlatoDto.nombre !== undefined) {
      plato.nombre = updatePlatoDto.nombre;
    }
    if (updatePlatoDto.precio !== undefined) {
      plato.precio = updatePlatoDto.precio;
    }
    if (updatePlatoDto.descripcion !== undefined) {
      plato.descripcion = updatePlatoDto.descripcion;
    }

    return { ...plato };
  }

  remove(id: number): void {
    const index = this.platos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException('No se encontró un plato con id ${id}');
    }
    this.platos.splice(index, 1);
  }
}
