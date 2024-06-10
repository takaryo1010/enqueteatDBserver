import { Entity,Column,PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { Choice } from "../../choices/entities/choice.entity";
@Entity('text_answer')
export class TextAnswer {
  @PrimaryGeneratedColumn()
  answer_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
    text: string;
    
  @ManyToOne(() => Choice, (choice) => choice.textAnswers)
  choice: Choice;
}