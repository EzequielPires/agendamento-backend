import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BusinessHour } from 'src/entities/businessHour.entity';
import { BusinessHoursService } from './business-hours.service';
import { CreateBusinessHourDto } from './dto/create-business-hour.dto';
import { FindBusinessHourDTO } from './dto/find-business-hour.dto';
import { UpdateBusinessHourDto } from './dto/update-business-hour.dto';

@Controller('business-hours')
export class BusinessHoursController {
  constructor(private readonly businessHoursService: BusinessHoursService) {}

  @Post()
  create(@Body() createBusinessHourDto: BusinessHour) {
    return this.businessHoursService.create(createBusinessHourDto);
  }

  @Get()
  findAll(@Query() query: FindBusinessHourDTO) {
    return this.businessHoursService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessHoursService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessHourDto: UpdateBusinessHourDto) {
    return this.businessHoursService.update(+id, updateBusinessHourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessHoursService.remove(+id);
  }
}
