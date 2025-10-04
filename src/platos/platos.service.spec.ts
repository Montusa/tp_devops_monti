import { Test, TestingModule } from '@nestjs/testing';
import { PlatosService } from './platos.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

describe('PlatosService', () => {
  let service: PlatosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatosService],
    }).compile();

    service = module.get<PlatosService>(PlatosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crea un plato nuevo correctamente', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Milanesa',
        precio: 1500,
        descripcion: 'Con papas',
      };

      const result = service.create(dto);

      expect(result.id).toEqual(expect.any(Number));
      expect(result).toMatchObject({
        nombre: dto.nombre,
        precio: dto.precio,
        descripcion: dto.descripcion,
      });

      expect(service.findAll()).toContainEqual(result);
    });

    it('lanza BadRequestException si nombre duplicado', () => {
      const dto1: CreatePlatoDto = {
        nombre: 'Pizza',
        precio: 2000,
        descripcion: 'Grande',
      };
      service.create(dto1);

      const dtoDuplicado: CreatePlatoDto = {
        nombre: 'Pizza',
        precio: 2500,
        descripcion: 'Otra descripción',
      };
      expect(() => service.create(dtoDuplicado)).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('retorna un arreglo vacío inicialmente', () => {
      const all = service.findAll();
      expect(all).toEqual([]);
    });

    it('no permite modificar el array interno desde afuera', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Empanada',
        precio: 300,
        descripcion: 'De carne',
      };
      const created = service.create(dto);

      const lista = service.findAll();
      lista.push({
        id: 999,
        nombre: 'Trucho',
        precio: 1,
        descripcion: 'Fake',
      });

      expect(service.findAll()).not.toContainEqual({
        id: 999,
        nombre: 'Trucho',
        precio: 1,
        descripcion: 'Fake',
      });
    });
  });

  describe('findOne', () => {
    it('retorna un plato existente por id', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Sopa',
        precio: 800,
        descripcion: 'De verduras',
      };
      const created = service.create(dto);

      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('retorna undefined si no existe el plato', () => {
      const found = service.findOne(9999);
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('actualiza los campos correctamente', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Hamburguesa',
        precio: 1200,
        descripcion: 'Con queso',
      };
      const created = service.create(dto);

      const updateDto: UpdatePlatoDto = {
        nombre: 'Hamburguesa XXL',
        precio: 1500,
        descripcion: 'Con queso extra',
      };

      const updated = service.update(created.id, updateDto);
      expect(updated).toMatchObject({
        nombre: updateDto.nombre,
        precio: updateDto.precio,
        descripcion: updateDto.descripcion,
      });
      expect(updated.id).toBe(created.id);
    });

    it('actualiza parcialmente (un solo campo)', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Tarta',
        precio: 1000,
        descripcion: 'De jamón y queso',
      };
      const created = service.create(dto);

      const updateDto: UpdatePlatoDto = {
        precio: 1100,
      };

      const updated = service.update(created.id, updateDto);
      expect(updated.precio).toBe(1100);
      expect(updated.nombre).toBe(created.nombre);
      expect(updated.descripcion).toBe(created.descripcion);
    });

    it('lanza NotFoundException si id no existe', () => {
      const updateDto: UpdatePlatoDto = {
        nombre: 'No existe',
      };
      expect(() => service.update(9999, updateDto)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('elimina un plato existente', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Ensalada',
        precio: 600,
        descripcion: 'Mixta',
      };
      const created = service.create(dto);

      const mensaje = service.remove(created.id);
      expect(mensaje).toContain(`${created.id}`);
      expect(service.findOne(created.id)).toBeUndefined();
    });

    it('lanza NotFoundException si id no existe', () => {
      expect(() => service.remove(9999)).toThrow(NotFoundException);
    });
  });
});
