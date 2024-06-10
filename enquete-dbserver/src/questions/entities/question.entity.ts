import { Entity, OneToMany } from "typeorm";
import { Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Form } from "../../forms/entities/form.entity";
import { Choice } from "../../choices/entities/choice.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    question_id: number;

    @Column()
    question_type: number;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    question_text: string;

    @ManyToOne(() => Form, form => form.questions, { eager: true })
    form: Form;

    @OneToMany(() => Choice, choice => choice.question,{eager: true})
    choices: Choice[];
}