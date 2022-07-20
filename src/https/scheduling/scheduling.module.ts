import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduling } from 'src/entities/scheduling.entity';
import { Business } from 'src/entities/business.entity';
import { Service } from 'src/entities/service.entity';
import { Client } from 'src/entities/client.entity';
import { UserModule } from '../user/user.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Scheduling, Business, Service, Client, User
    ])
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService]
})
export class SchedulingModule {}
