import { Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Entity } from "typeorm";
import { Form } from "../../forms/entities/form.entity";

@Entity()
export class User { 
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    user_email: string;

    @OneToMany(() => Form, form => form.user, { eager: true })
    forms: Form[];
}
