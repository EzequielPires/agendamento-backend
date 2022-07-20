import { Business } from "src/entities/business.entity";

export class CreateBusinessHourDto {
    days: number[];
    start: Date;
    end: Date;
    createdAt: Date;
    business: Business;
}
