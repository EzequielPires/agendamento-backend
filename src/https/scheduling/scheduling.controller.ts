import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Scheduling } from 'src/entities/scheduling.entity';
import { findSchedulingDto } from './dto/find-scheduling.dto';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  create(@Body() createSchedulingDto: CreateSchedulingDto) {
    return this.schedulingService.create(createSchedulingDto);
  }

  @Get()
  findAll(@Query() queryDTO: findSchedulingDto) {
    return this.schedulingService.findAll(queryDTO);
  }

  @Get('available-times')
  availableTimes(@Query() queryDTO: findSchedulingDto) {
    return this.schedulingService.availableTimes(queryDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchedulingDto: UpdateSchedulingDto) {
    return this.schedulingService.update(+id, updateSchedulingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulingService.remove(+id);
  }
}
