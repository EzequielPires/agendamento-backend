import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusinessHour } from "./businessHour.entity";
import { Scheduling } from "./scheduling.entity";
import { Service } from "./service.entity";
import { User } from "./user.entity";

@Entity()
export class Business {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: null, nullable: true })
    logo: string;

    @Column({ default: null, nullable: true })
    banner: string;

    @Column()
    phone: string;

    @OneToOne(() => User, user => user.businessToManege, { nullable: false })
    @JoinColumn()
    admin: User;

    @OneToMany(() => User, collaborator => collaborator.business, { cascade: true, onDelete: 'CASCADE' })
    collaborators: User[];

    @OneToMany(() => Service, service => service.business, { cascade: true, onDelete: 'CASCADE' })
    services: Service[];

    @OneToOne(() => BusinessHour, business_hour => business_hour.business, { eager: true, onDelete: 'CASCADE' })
    business_hour: BusinessHour;

    @OneToMany(() => Scheduling, scheduling => scheduling.business, { onDelete: 'CASCADE' })
    schedules: Scheduling[];
}
