import { Module } from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';
import { BusinessHoursController } from './business-hours.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessHour } from 'src/entities/businessHour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessHour])],
  controllers: [BusinessHoursController],
  providers: [BusinessHoursService]
})
export class BusinessHoursModule {}
