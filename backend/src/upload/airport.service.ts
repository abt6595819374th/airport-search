import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './airport.entity';
import { Like, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from './airport.dto';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport) private readonly repository: Repository<Airport>,
  ) {}
  deleteAirports() {
    return this.repository.clear();
  }
  async uploadFile(file: Express.Multer.File) {
    const content = file.buffer.toString();
    const lines = content.trim().split('\n');

    if (lines.length < 2) {
      throw new BadRequestException(
        'CSV file must have a header and at least one data line',
      );
    }

    const dataLines = lines.slice(1);

    if (dataLines.length > 1) {
      await this.deleteAirports();
    }

    const airports = dataLines.map((line, index) => {
      const parts = line.split(',');
      if (parts.length !== 5) {
        throw new BadRequestException(
          `Invalid CSV format on line ${index + 2}`,
        );
      }

      const [name, iata, unlocode, country, city] = parts.map((p) => p.trim());

      const airport = new Airport();
      airport.name = name;
      airport.iata = iata;
      airport.unlocode = unlocode;
      airport.country = country;
      airport.city = city;
      return airport;
    });

    await Promise.all(airports.map((airport) => this.repository.save(airport)));
  }

  async findAirport(search: string) {
    const airports = await this.repository.find({
      where: [
        {
          name: Like(`%${search}%`),
        },
        { iata: Like(`%${search}%`) },
        { unlocode: Like(`%${search}%`) },
        {
          country: Like(`%${search}%`),
        },
        {
          city: Like(`%${search}%`),
        },
      ],
    });
    return plainToInstance(AirportDto, airports);
  }
}
