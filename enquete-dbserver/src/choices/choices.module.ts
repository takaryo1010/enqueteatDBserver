import { Module } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { ChoicesController } from './choices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from './entities/choice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Choice]),],
  controllers: [ChoicesController],
  providers: [ChoicesService],
})
export class ChoicesModule {}
