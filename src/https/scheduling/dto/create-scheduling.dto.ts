import { Business } from "src/entities/business.entity";
import { Client } from "src/entities/client.entity";
import { Service } from "src/entities/service.entity";
import { User } from "src/entities/user.entity";

export class CreateSchedulingDto {
    business: Business;
    service: Service;
    collaborator: User;
    client: Client;
    date: string;
    time: string;
}
