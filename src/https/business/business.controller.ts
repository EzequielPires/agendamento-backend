import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Business } from 'src/entities/business.entity';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { FindBusinessDTO } from './dto/find-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

interface RequestAddService {
  serviceId: string;
  businessId: string;
}

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: Business) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  findAll(@Query() queryDTO: FindBusinessDTO) {
    return this.businessService.findAll(queryDTO);
  }

  @Post('add-service')
  addService(@Body() body: RequestAddService) {
    console.log(body);
    return this.businessService.addService(body.businessId, body.serviceId);
  }

  @Post('add-collaborator')
  addCollaborator(@Body() body) {
    return this.businessService.addCollaborator(body.businessId, body.collaboratorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
