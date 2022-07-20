import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Business } from "./business.entity";
import { Client } from "./client.entity";
import { Service } from "./service.entity";
import { User } from "./user.entity";

interface DateDetailProps {
    date: string,
    start: string,
    end: string,
}

@Entity()
export class Scheduling {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column("simple-json", {default: null, nullable: true})
    details: DateDetailProps;
    
    @ManyToOne(() => Business, business => business.schedules, {nullable: false, onDelete: 'CASCADE'})
    business: Business;

    @ManyToOne(() => User, client => client.schedules, {nullable: false, onDelete: 'CASCADE'})
    client: User;

    @ManyToOne(() => Service, service => service.schedules, {nullable: false, onDelete: 'CASCADE'})
    service: Service;

    @ManyToOne(() => User, collaborator => collaborator.schedules, {nullable: false, onDelete: 'CASCADE'})
    collaborator: User;
}   
