import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { Scheduling } from 'src/entities/scheduling.entity';
import { Service } from 'src/entities/service.entity';
import {
  generateSchedules,
  toLocaleDateString
} from 'src/helpers/date.helper';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { findSchedulingDto } from './dto/find-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';


interface SchedulesTimes {
  start: string;
  end: string;
}

interface DateDetailProps extends SchedulesTimes {
  date: string,
}

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Scheduling) private schedulingRepository: Repository<Scheduling>,
    @InjectRepository(Business) private businessRepository: Repository<Business>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    private readonly userService: UserService
  ) { }

  async create(schedulingDto: CreateSchedulingDto) {
    try {
      const { date, time, business, service, collaborator, client } = schedulingDto;
      const [day, month, year] = date.split('/');

      const freeTimes = await this.availableTimes({
        day,
        month,
        year,
        business: String(business),
        service: String(service),
        collaborator: String(collaborator),
      }).then(res => res.data);

      let timeIsFee = false;
      let freeTime: SchedulesTimes;

      freeTimes.forEach((item: SchedulesTimes) => {
        if (item.start === time) {
          timeIsFee = true;
          freeTime = item;
        }
      });

      if (!timeIsFee) {
        throw new Error("Horário indisponível!");
      }

      const scheduling = this.schedulingRepository.create({
        business,
        collaborator,
        service,
        date: `${year}-${month}-${day}T${time}Z`,
        details: {
          date: date,
          start: freeTime.start,
          end: freeTime.end
        },
        client
      });

      return {
        success: true,
        data: await this.schedulingRepository.save(scheduling)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async filterScheduling(data: CreateSchedulingDto) {
    try {
      const query = this.schedulingRepository.createQueryBuilder('scheduling')
      query.leftJoinAndSelect("scheduling.business", "business")
      query.leftJoinAndSelect("scheduling.service", "service")
      query.leftJoinAndSelect("scheduling.collaborator", "collaborator");
      { data.business ? query.where('business.id = :business', { business: data.business }) : null }
      { data.collaborator ? query.andWhere('collaborator.id = :collaborator', { collaborator: data.collaborator }) : null }
      { data.service ? query.andWhere('service.id = :service', { service: data.service }) : null }

      query.orderBy('scheduling.date', 'DESC');

      const result = await query.getMany();
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDTO: findSchedulingDto) {
    try {
      const query = this.schedulingRepository.createQueryBuilder('scheduling')
        .leftJoin('scheduling.business', 'business')
        .leftJoinAndSelect('scheduling.service', 'service')
        .leftJoinAndSelect('scheduling.collaborator', 'collaborator')
        .leftJoinAndSelect('scheduling.client', 'client');

      const { day, month, year, collaborator, business, service } = queryDTO;

      if (day && month && year) {
        const date = new Date(Number(year), Number(month), Number(day));
        const [dateFormated,] = toLocaleDateString(date);
        query.andWhere('scheduling.details like :date', { date: `%${dateFormated}%` });
      }

      { business ? query.andWhere('business.id = :business', { business }) : null }
      { collaborator ? query.andWhere('collaborator.id = :collaborator', { collaborator }) : null }
      { service ? query.andWhere('service.id = :service', { service }) : null }

      query.orderBy('scheduling.date', 'ASC');

      const schedules = await query.getMany();

      return {
        success: true,
        data: schedules
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async availableTimes(queryDTO: findSchedulingDto) {
    try {
      
      const serviceExisteInCollaborator = await this.userService.findAll({
        id: String(queryDTO.collaborator),
        service: String(queryDTO.service)
      }).then(res => res.data);

      if(serviceExisteInCollaborator.length <= 0) {
        throw new Error('Este serviço não pertence a esse colaborador');
      }

      const { data } = await this.findAll({
        business: queryDTO.business,
        collaborator: queryDTO.collaborator,
        day: queryDTO.day,
        month: Number(queryDTO.month) - 1,
        year: queryDTO.year
      });

      const service = await this.serviceRepository.findOne({
        where: {
          id: String(queryDTO.service)
        }
      });

      const business = await this.businessRepository.findOne({
        where: {
          id: String(queryDTO.business)
        }
      });

      const { year, month, day } = queryDTO;
      let dateString = `${year}-${month}-${day}T00:00:00Z`;
      const date = new Date(dateString);

      const schedules: any = generateSchedules(
        date,
        business.business_hour,
        data,
        service.duration
      );

      return {
        success: true,
        data: schedules
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduling`;
  }

  update(id: number, updateSchedulingDto: UpdateSchedulingDto) {
    return `This action updates a #${id} scheduling`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduling`;
  }
}
