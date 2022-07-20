import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessHour } from 'src/entities/businessHour.entity';
import { Like, Repository } from 'typeorm';
import { FindBusinessHourDTO } from './dto/find-business-hour.dto';
import { UpdateBusinessHourDto } from './dto/update-business-hour.dto';

@Injectable()
export class BusinessHoursService {
  constructor(@InjectRepository(BusinessHour) private businessHourRepository: Repository<BusinessHour>) { }

  async create({
    business,
    days,
    end,
    start,
    segunda,
    terca,
    quarta,
    quinta,
    sexta,
    sabado,
    domingo
  }: BusinessHour) {
    try {
      let businessHour: BusinessHour;
      const existBusinessHour = await this.businessHourRepository.findOne({
        where: { business: Like(`%${business}%`) }
      })
      if (!existBusinessHour) {
        businessHour = this.businessHourRepository.create({
          business,
          days,
          end,
          start,
          segunda,
          terca,
          quarta,
          quinta,
          sexta,
          sabado,
          domingo
        });
      } else {
        businessHour = existBusinessHour;
        businessHour.segunda = segunda;
        businessHour.terca = terca;
        businessHour.quarta = quarta;
        businessHour.quinta = quinta;
        businessHour.sexta = sexta;
        businessHour.sabado = sabado;
        businessHour.domingo = domingo;
      }

      return {
        success: true,
        data: await this.businessHourRepository.save(businessHour)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(query: FindBusinessHourDTO) {
    try {
      const businessHours = await this.businessHourRepository.find({
        relations: ["business"],
        where: {
          business: Like(`%${query.business}%`)
        }
      });
      return {
        success: true,
        data: businessHours
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} businessHour`;
  }

  update(id: number, updateBusinessHourDto: UpdateBusinessHourDto) {
    return `This action updates a #${id} businessHour`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessHour`;
  }
}
