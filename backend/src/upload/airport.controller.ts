import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('airports')
export class AirportController {
  constructor(private uploadService: AirportService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.uploadService.uploadFile(file);
  }

  @Get()
  findAirport(@Query('search') search: string) {
    return this.uploadService.findAirport(search);
  }
}
