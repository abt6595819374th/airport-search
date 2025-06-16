import { Module } from '@nestjs/common';
import { AirportModule } from './upload/airport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './typeorm.config';

@Module({
  imports: [AirportModule, TypeOrmModule.forRoot(AppDataSource.options)],
})
export class AppModule {}
