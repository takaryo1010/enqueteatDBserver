import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";
import { User } from "../../users/entities/user.entity";
@Entity()
export class Form {
    @PrimaryGeneratedColumn()
    form_id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    form_title: string;
    
    @OneToMany(() => Question, question => question.form)
    questions: Question[];
    
    @ManyToOne(() => User, user => user.forms)
    user: User;
    
} 
