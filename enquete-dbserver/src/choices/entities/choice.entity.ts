import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Question } from "../../questions/entities/question.entity";
@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    choice_id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    choice_text: string;

    @Column({type: 'int', nullable: false, default: 0})
    vote_counter: number;
    
    @ManyToOne(() => Question, question => question.choices)
    question: Question;
}
