import { Module } from '@nestjs/common';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { Airport } from './airport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AirportController],
  providers: [AirportService],
  imports: [TypeOrmModule.forFeature([Airport])],
})
export class AirportModule {}
