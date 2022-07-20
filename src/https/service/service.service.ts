import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { FindServicesDTO } from './dto/find-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(Service) private serviceRepository: Repository<Service>) { }

  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = this.serviceRepository.create(createServiceDto);
      return {
        success: true,
        data: await this.serviceRepository.save(service)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDTO: FindServicesDTO) {
    try {
      const query = this.serviceRepository.createQueryBuilder('service')
      .leftJoin('service.business', 'business')
      .leftJoin('service.collaborators', 'collaborators');

      const {business, collaborator} = queryDTO;

      {business ? query.andWhere('business.id = :id', {id: business}) : null}
      {collaborator ? query.andWhere('collaborator.id = :id', {id: collaborator}) : null}

      const services = await query.getMany();
      return {
        success: true,
        data: services
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: string) {
    try {
      const service = await this.serviceRepository.findOne({
        where: {id},
      });
      return {
        success: true,
        data: service
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.serviceRepository.findOne({
        where: {id}
      });
      if(!service) {
        throw new Error('Service not found');
      }
      
      await this.serviceRepository.update({id}, updateServiceDto);

      return {
        success: true,
        data: await this.serviceRepository.findOne({
          where: {id}
        })
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
