import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import { AirportService } from './airport.service';
import { Airport } from './airport.entity';

describe('AirportService', () => {
  let service: AirportService;

  const mockRepository = {
    clear: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportService,
        {
          provide: getRepositoryToken(Airport),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AirportService>(AirportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteAirports', () => {
    it('should call repository.clear()', async () => {
      mockRepository.clear.mockResolvedValue(undefined);

      await service.deleteAirports();

      expect(mockRepository.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('uploadFile', () => {
    const createMockFile = (content: string): Express.Multer.File =>
      ({
        fieldname: 'file',
        originalname: 'airports.csv',
        mimetype: 'text/csv',
        buffer: Buffer.from(content),
        size: content.length,
        destination: '',
        filename: '',
        path: '',
        stream: new Readable(),
      }) as Partial<Express.Multer.File> as Express.Multer.File;

    it('should throw BadRequestException when file has no data lines', async () => {
      const file = createMockFile('name,iata,unlocode,country,city\n');

      await expect(service.uploadFile(file)).rejects.toThrow(
        new BadRequestException(
          'CSV file must have a header and at least one data line',
        ),
      );
    });

    it('should throw BadRequestException when file is empty', async () => {
      const file = createMockFile('');

      await expect(service.uploadFile(file)).rejects.toThrow(
        new BadRequestException(
          'CSV file must have a header and at least one data line',
        ),
      );
    });

    it('should throw BadRequestException when CSV line has invalid format', async () => {
      const file = createMockFile(
        'name,iata,unlocode,country,city\nAAmsterdam Airport Schiphol,AMS,',
      );

      await expect(service.uploadFile(file)).rejects.toThrow(
        new BadRequestException('Invalid CSV format on line 2'),
      );
    });

    it('should successfully upload single airport without clearing existing data', async () => {
      const csvContent =
        'name,iata,unlocode,country,city\nAmsterdam Airport Schiphol,AMS,NLAMS,Netherlands,Amsterdam';
      const file = createMockFile(csvContent);

      mockRepository.save.mockResolvedValue({} as Airport);

      await service.uploadFile(file);

      expect(mockRepository.clear).toHaveBeenCalledTimes(1);
      expect(mockRepository.clear).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith({
        name: 'Amsterdam Airport Schiphol',
        iata: 'AMS',
        unlocode: 'NLAMS',
        country: 'Netherlands',
        city: 'Amsterdam',
      });
    });

    it('should trim whitespace from CSV fields', async () => {
      const csvContent =
        'name,iata,unlocode,country,city\n  Amsterdam Airport Schiphol  ,  AMS  ,  NLAMS  ,  Netherlands  ,  Amsterdam  ';
      const file = createMockFile(csvContent);

      mockRepository.save.mockResolvedValue({} as Airport);

      await service.uploadFile(file);

      expect(mockRepository.save).toHaveBeenCalledWith({
        name: 'Amsterdam Airport Schiphol',
        iata: 'AMS',
        unlocode: 'NLAMS',
        country: 'Netherlands',
        city: 'Amsterdam',
      });
    });

    it('should handle Promise.all rejection when saving fails', async () => {
      const csvContent =
        'name,iata,unlocode,country,city\nSchiphol Airport,AMS,NLAMS,Netherlands,Amsterdam';
      const file = createMockFile(csvContent);

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.uploadFile(file)).rejects.toThrow('Database error');
    });
  });

  describe('findAirport', () => {
    const mockAirports: Airport[] = [
      {
        id: 1,
        name: 'London Stansted Airport',
        iata: 'STN',
        unlocode: 'GBLON',
        country: 'United Kingdom',
        city: 'London',
      },
      {
        id: 2,
        name: 'London Gatwick Airport',
        iata: 'LGW',
        unlocode: 'GBLON',
        country: 'United Kingdom',
        city: 'London',
      },
    ];

    it('should search airports by name', async () => {
      mockRepository.find.mockResolvedValue(mockAirports);

      const result = await service.findAirport('London');

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('London Stansted Airport');
    });

    it('should search airports by IATA code', async () => {
      mockRepository.find.mockResolvedValue([mockAirports[0]]);

      const result = await service.findAirport('STN');

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]?.iata).toBe('STN');
    });

    it('should return empty array when no airports found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAirport('NonExistent');

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      mockRepository.find.mockRejectedValue(
        new Error('Database connection error'),
      );

      await expect(service.findAirport('AMS')).rejects.toThrow(
        'Database connection error',
      );
    });
  });
});
