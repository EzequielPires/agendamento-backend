import { User } from "src/entities/user.entity";
import { Entity, OneToMany } from "typeorm";
import { Scheduling } from "./scheduling.entity";

@Entity()
export class Client extends User{
    @OneToMany(() => Scheduling, scheduling => scheduling.client)
    schedules: Scheduling[];
}