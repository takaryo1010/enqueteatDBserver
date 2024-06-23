import { Controller, Get, Post, Delete, Param, Body,Patch } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@Controller('questions')
@ApiTags('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({
    summary: '全ての質問を取得',
    description: 'システム内の全ての質問のリストを取得します。',
  })
  @ApiResponse({
    status: 200,
    description: '質問のリストが正常に取得されました。',
    isArray: true,
    schema: {
      example: [
        [
          {
            question_id: 1,
            question_type: 0,
            question_text: 'question 1',
            choices: [
              {
                choice_id: 1,
                choice_text: 'choice 3',
                vote_counter: 2,
                textAnswers: [
                  {
                    answer_id: 1,
                    text: 'テキスト回答',
                  },
                  {
                    answer_id: 2,
                    text: 'テキスト回答',
                  },
                  {
                    answer_id: 11,
                    text: 'テキスト回答',
                  },
                  {
                    answer_id: 15,
                    text: 'テキスト回答',
                  },
                ],
              },
            ],
            form: {
              form_id: 6,
              form_title: 'フォームのタイトル6',
              form_administrator: null,
            },
          },
          {
            question_id: 2,
            question_type: 0,
            question_text: 'さしすせそ',
            choices: [
              {
                choice_id: 2,
                choice_text: 'たちつてと',
                vote_counter: 1,
                textAnswers: [],
              },
            ],
            form: {
              form_id: 7,
              form_title: 'あいうえお',
              form_administrator: null,
            },
          },
          {
            question_id: 3,
            question_type: 3,
            question_text: 'question 3',
            choices: [
              {
                choice_id: 3,
                choice_text: '多い',
                vote_counter: 13,
                textAnswers: [],
              },
              {
                choice_id: 4,
                choice_text: '少ない',
                vote_counter: 16,
                textAnswers: [],
              },
            ],
            form: {
              form_id: 8,
              form_title: '学校',
              form_administrator: null,
            },
          },
        ],
      ],
    },
  })
  findAll(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'IDによる質問の取得(CSRFトークン必須)',
    description: 'IDによって特定の質問を取得します。',
  })
  @ApiParam({ name: 'id', description: '取得する質問のID' })
  @ApiResponse({
    status: 200,
    description: '質問が正常に取得されました。',
    schema: {
      example: {
        question_id: 1,
        question_type: 0,
        question_text: 'question 1',
        form: {
          form_id: 6,
          form_title: 'フォームのタイトル6',
          form_administrator: null,
        },
        choices: [
          {
            choice_id: 1,
            choice_text: 'choice 3',
            vote_counter: 2,
            textAnswers: [
              {
                answer_id: 1,
                text: 'テキスト回答',
              },
              {
                answer_id: 2,
                text: 'テキスト回答',
              },
              {
                answer_id: 11,
                text: 'テキスト回答',
              },
              {
                answer_id: 15,
                text: 'テキスト回答',
              },
            ],
          },
        ],
      },
    },
  })
  findOne(@Param('id') id: number): Promise<Question> {
    return this.questionsService.findOne(id);
  }
  @Get(':formId/form')
  @ApiOperation({
    summary: 'フォームIDによる質問の取得',
    description: 'フォームIDによって特定の質問を取得します。',
  })
  @ApiParam({ name: 'formId', description: '取得する質問のフォームID' })
  @ApiResponse({
    status: 200,
    description: '質問が正常に取得されました。',
    isArray: true,
    schema: {
      example: [
        {
          question_id: 1,
          question_type: 3,
          question_text: 'questionqqq',
          form: {
            form_id: 6,
            form_title: 'フォームのタイトル6',
            form_administrator: null,
          },
          choices: [
            {
              choice_id: 1,
              choice_text: 'choice 3',
              vote_counter: 2,
              textAnswers: [
                {
                  answer_id: 1,
                  text: 'テキスト回答',
                },
                {
                  answer_id: 2,
                  text: 'テキスト回答',
                },
                {
                  answer_id: 11,
                  text: 'テキスト回答',
                },
                {
                  answer_id: 15,
                  text: 'テキスト回答',
                },
              ],
            },
          ],
        },
      ],
    },
  })
  findOneByFormId(@Param('formId') formId: number): Promise<Question[]> {
    return this.questionsService.findOneByFormId(formId);
  }
  @Post()
  @ApiOperation({
    summary: '新規質問の作成',
    description: 'システム内に新しい質問を作成します。',
  })
  @ApiBody({
    schema: {
      example: {
        question_text: 'question 3',
        question_type: 1,
        form: {
          form_id: 1,
        },
      },
    },
    description: '作成する質問の詳細',
  })
  @ApiResponse({
    status: 201,
    description: '質問が正常に作成されました。',
    schema: {
      example: {
        question_text: 'クエスチョンテキスト3',
        question_type: 1,
        form: {
          form_id: 1,
        },
        question_id: 3,
      },
    },
  })
  create(@Body() question: Question): Promise<Question> {
    return this.questionsService.create(question);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'IDによる質問の削除',
    description: 'IDによって特定の質問を削除します。',
  })
  @ApiParam({ name: 'id', description: '削除する質問のID' })
  @ApiResponse({
    status: 200,
    description: '質問が正常に削除されました。',
  })
  @ApiResponse({ status: 404, description: '質問が見つかりません。' })
  remove(@Param('id') id: number): Promise<void> {
    return this.questionsService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'IDによる質問の更新',
    description: 'IDによって特定の質問テキストを更新します。',
  })
  @ApiParam({ name: 'id', description: '更新する質問のID' })
  @ApiBody({
    schema: {
      example: {
        question_id: 1,
        question_type: 3,
        question_text: 'questionqqq',
        form: {
          form_id: 6,
          form_title: 'フォームのタイトル6',
          form_administrator: null,
        },
        choices: [
          {
            choice_id: 1,
            choice_text: 'choice 3',
            vote_counter: 2,
            textAnswers: [
              {
                answer_id: 1,
                text: 'テキスト回答',
              },
              {
                answer_id: 2,
                text: 'テキスト回答',
              },
              {
                answer_id: 11,
                text: 'テキスト回答',
              },
              {
                answer_id: 15,
                text: 'テキスト回答',
              },
            ],
          },
        ],
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() question: Question,
  ): Promise<Question> {
    return this.questionsService.update(id, question);
  }
}
