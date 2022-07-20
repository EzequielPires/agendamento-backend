import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { Service } from 'src/entities/service.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { FindBusinessDTO } from './dto/find-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business) private repositoryBusiness: Repository<Business>,
    @InjectRepository(Service) private repositoryService: Repository<Service>,
    @InjectRepository(User) private repositoryCollaborator: Repository<User>
  ) { }

  async create(createBusinessDto: Business) {
    try {
      const business = this.repositoryBusiness.create(createBusinessDto);
      return {
        success: true,
        data: await this.repositoryBusiness.save(business),
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  async findAll(queryDTO: FindBusinessDTO) {
    try {
      const { id } = queryDTO;
      const business = await this.repositoryBusiness.find({ relations: ['business_hour', 'schedules', 'collaborators', 'services'], where: { id } });
      return {
        success: false,
        data: business,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  async addService(businessId: string, serviceId: string) {
    try {
      const business = await this.repositoryBusiness.findOne({
        where: {
          id: businessId
        }
      });
      const service = await this.repositoryService.findOne({
        where: {
          id: serviceId
        }
      });

      if (!business) {
        throw new Error("Business not found!");
      }
      if (!service) {
        throw new Error("Service not found!");
      }

      const services = [...business.services, service];

      business.services = services;

      await this.repositoryBusiness.save(business);

      return {
        success: true,
        data: `Service ${service.title} add success in business ${business.name}`
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async addCollaborator(businessId: string, collaboratorId: string) {
    try {
      const business = await this.repositoryBusiness.findOne({
        where: {
          id: businessId
        }
      });

      const collaborator = await this.repositoryCollaborator.findOne({
        where: {
          id: collaboratorId
        }
      });

      if (!business) {
        throw new Error("Business not found!");
      }

      if (!collaborator) {
        throw new Error("Collaborator not found!");
      }

      const collaborators = [...business.collaborators, collaborator];

      business.collaborators = collaborators;

      await this.repositoryBusiness.save(business)

      return {
        success: true,
        data: `Collaborator ${collaborator.name} add success in business ${business.name}`
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
