import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/congiguration'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';

import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { FormsModule } from './forms/forms.module';
import { QuestionsModule } from './questions/questions.module';
import { ChoicesModule } from './choices/choices.module';
import { UsersModule } from './users/users.module';
import { TextAnswerModule } from './text-answer/text-answer.module';

@Module({
  imports: [
    AppModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: ['dist/**/entities/**/*.entity.js'],
      }),
      inject: [ConfigService],
    }),
    FormsModule,
    QuestionsModule,
    ChoicesModule,
    UsersModule,
    TextAnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
