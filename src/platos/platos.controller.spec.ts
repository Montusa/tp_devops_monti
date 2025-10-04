import { Test, TestingModule } from '@nestjs/testing';
import { PlatosController } from './platos.controller';
import { PlatosService } from './platos.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PlatosController', () => {
  let controller: PlatosController;
  let service: PlatosService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatosController],
      providers: [
        {
          provide: PlatosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlatosController>(PlatosController);
    service = module.get<PlatosService>(PlatosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delega a servicio.create y retorna valor', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Milanesa',
        precio: 1500,
        descripcion: 'Con papas',
      };
      const returned = { id: 1, ...dto };
      (service.create as jest.Mock).mockReturnValue(returned);

      expect(controller.create(dto)).toBe(returned);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('deja propagar excepción si servicio lanza BadRequestException', () => {
      const dto: CreatePlatoDto = {
        nombre: 'Igual',
        precio: 1000,
        descripcion: 'Descripción',
      };
      (service.create as jest.Mock).mockImplementation(() => {
        throw new BadRequestException('error');
      });

      expect(() => controller.create(dto)).toThrow(BadRequestException);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('consulta todos los platos delegando al servicio', () => {
      const arr = [
        { id: 1, nombre: 'X', precio: 100, descripcion: 'Y' },
        { id: 2, nombre: 'Z', precio: 200, descripcion: 'W' },
      ];
      (service.findAll as jest.Mock).mockReturnValue(arr);

      expect(controller.findAll()).toBe(arr);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devuelve el plato consultado por id', () => {
      const id = 5;
      const retorno = { id, nombre: 'A', precio: 500, descripcion: 'D' };
      (service.findOne as jest.Mock).mockReturnValue(retorno);

      // Notar aquí que en el controller usabas `@Param('id') id: string` y convertías con +id,
      // pero idealmente podrías usar ParseIntPipe. En este test simulamos el comportamiento actual.
      expect(controller.findOne(String(id))).toBe(retorno);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('propaga excepción si el servicio la lanza', () => {
      (service.findOne as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('no existe');
      });

      expect(() => controller.findOne('99')).toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(99);
    });
  });

  describe('update', () => {
    it('actualiza correctamente un plato', () => {
      const id = 3;
      const updateDto: UpdatePlatoDto = { nombre: 'Nuevo nombre' };
      const retorno = {
        id,
        nombre: 'Nuevo nombre',
        precio: 0,
        descripcion: '',
      };
      (service.update as jest.Mock).mockReturnValue(retorno);

      expect(controller.update(id, updateDto)).toBe(retorno);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('propaga excepción si servicio.update lanza NotFoundException', () => {
      const id = 7;
      const updateDto: UpdatePlatoDto = { precio: 1234 };
      (service.update as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('no encontrado');
      });

      expect(() => controller.update(id, updateDto)).toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('remove', () => {
    it('elimina un plato correctamente', () => {
      const id = 4;
      const mensaje = `El plato con id ${id} fue eliminado correctamente`;
      (service.remove as jest.Mock).mockReturnValue(mensaje);

      expect(controller.remove(id)).toBe(mensaje);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('propaga excepción si el servicio lanza NotFoundException', () => {
      const id = 99;
      (service.remove as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('no encontrado');
      });

      expect(() => controller.remove(id)).toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

/*
import { Test, TestingModule } from '@nestjs/testing';
import { PlatosController } from './platos.controller';
import { PlatosService } from './platos.service';

describe('PlatosController', () => {
  let controller: PlatosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatosController],
      providers: [PlatosService],
    }).compile();

    controller = module.get<PlatosController>(PlatosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
*/
