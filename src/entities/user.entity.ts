import { hashSync } from "bcrypt";
import { Role } from "src/models/role.enum";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Business } from "./business.entity";
import { Scheduling } from "./scheduling.entity";
import { Service } from "./service.entity";

@Entity()
@Unique(["email"])
export abstract class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: null, nullable: true })
    avatar: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.Client })
    role: Role;

    @Column("simple-json", { default: null, nullable: true })
    adress: {
        city: string,
        uf: string,
        cep: string,
        nation: string,
        number: string,
        geo: {
            type: string,
            coordinates: string,
        }
    };

    @OneToOne(() => Business, businessToManege => businessToManege.admin)
    businessToManege: Business;

    @ManyToOne(() => Business, business => business.collaborators)
    business: Business;

    @ManyToMany(() => Service, service => service.collaborators, {onDelete: 'CASCADE'} )
    services: Service[];

    @OneToMany(() => Scheduling, scheduling => scheduling.collaborator, { onDelete: 'CASCADE' })
    schedules: Scheduling[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date;

    @BeforeInsert()
    hashPassword() {
        this.password = hashSync(this.password, 10);
    }
}