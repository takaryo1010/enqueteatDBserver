import { Module } from '@nestjs/common';
import { TextAnswerService } from './text-answer.service';
import { TextAnswerController } from './text-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextAnswer } from './entities/text-answer.entity';

@Module({
  controllers: [TextAnswerController],
  providers: [TextAnswerService],
  imports: [TypeOrmModule.forFeature([TextAnswer])],
})
export class TextAnswerModule {}
