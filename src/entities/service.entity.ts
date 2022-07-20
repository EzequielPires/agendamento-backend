import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Business } from "./business.entity";
import { Scheduling } from "./scheduling.entity";
import { User } from "./user.entity";

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({default: null, nullable: true})
    photo: string;

    @Column()
    price: number;

    @Column()
    duration: number;

    @Column({default: true})
    status: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date;

    @ManyToOne(() => Business, business => business.services, {nullable: false})
    business: Business;

    @ManyToMany(() => User, collaborator => collaborator.services, {
        cascade: true
    })
    @JoinTable()
    collaborators: User[];

    @OneToMany(() => Scheduling, scheduling => scheduling.service)
    schedules: Scheduling[];
}
