import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";
@Entity()
export class Form {
    @PrimaryGeneratedColumn()
    form_id: number;

    @Column()
    form_title: string;
    
    @OneToMany(() => Question, question => question.form)
    questions: Question[];
} 
