import { Module } from '@nestjs/common';
import { BusinessModule } from './https/business/business.module';
import { ServiceModule } from './https/service/service.module';
import { BusinessHoursModule } from './https/business-hours/business-hours.module';
import { SchedulingModule } from './https/scheduling/scheduling.module';
import { ClientModule } from './https/client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './https/user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'term228687535',
      database: 'scheduling',
      entities: [
        "dist/**/*.entity{.ts,.js}"
      ],
      synchronize: true,
    }),
    BusinessModule,
    ServiceModule,
    BusinessHoursModule,
    SchedulingModule,
    ClientModule,
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
