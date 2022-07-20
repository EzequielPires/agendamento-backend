import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Business } from "./business.entity";

export type UserRole = "DOM" | "SEG" | "TER" | "QUA" | "QUI" | "SEX" | "SAB";

export interface Timeday {
    start: string;
    end: string;
}

@Entity()
export class BusinessHour {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "set",
        enum: ["DOM", "SEG", "TER"],
    })
    days: UserRole[];

    @Column({ type: 'datetime' })
    start: Date;

    @Column({ type: 'datetime' })
    end: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToOne(() => Business, business => business.business_hour, {onDelete: 'CASCADE'})
    @JoinColumn()
    business: Business;

    @Column("simple-json", {nullable: true})
    segunda: Timeday[];
    
    @Column("simple-json", {nullable: true})
    terca: Timeday[];
    
    @Column("simple-json", {nullable: true})
    quarta: Timeday[];
    
    @Column("simple-json", {nullable: true})
    quinta: Timeday[];
    
    @Column("simple-json", {nullable: true})
    sexta: Timeday[];
    
    @Column("simple-json", {nullable: true})
    sabado: Timeday[];
    
    @Column("simple-json", {nullable: true})
    domingo: Timeday[];
}
