import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { ServiceModule } from "../service/service.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ServiceModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
}) export class UserModule {}