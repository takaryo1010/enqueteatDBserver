import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Question } from "../../questions/entities/question.entity";
@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    choice_id: number;

    @Column()
    choice_text: string;

    @Column()
    vote_counter: number;
    
    @ManyToOne(() => Question, question => question.choices)
    question: Question;
}
