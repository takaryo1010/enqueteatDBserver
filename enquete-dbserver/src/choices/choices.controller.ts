import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { Choice } from './entities/choice.entity';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TextAnswer } from 'src/text-answer/entities/text-answer.entity';
@Controller('choices')
@ApiTags('choices')
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Get()
  @ApiOperation({
    summary: '全ての選択肢を取得',
    description: 'システム内の全ての選択肢のリストを取得します。',
  })
  @ApiResponse({
    status: 200,
    description: '選択肢のリストが正常に取得されました。',
    isArray: true,
    schema: {
      example: [
        {
          choice_id: 1,
          choice_text: 'choice 3',
          vote_counter: 2,
          question: {
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
              },
            ],
          },
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
        {
          choice_id: 2,
          choice_text: 'たちつてと',
          vote_counter: 1,
          question: {
            question_id: 2,
            question_type: 0,
            question_text: 'さしすせそ',
            form: {
              form_id: 7,
              form_title: 'あいうえお',
              form_administrator: null,
            },
            choices: [
              {
                choice_id: 2,
                choice_text: 'たちつてと',
                vote_counter: 1,
              },
            ],
          },
          textAnswers: [],
        },
        {
          choice_id: 3,
          choice_text: '多い',
          vote_counter: 13,
          question: {
            question_id: 3,
            question_type: 3,
            question_text: 'question 3',
            form: {
              form_id: 8,
              form_title: '学校',
              form_administrator: null,
            },
            choices: [
              {
                choice_id: 3,
                choice_text: '多い',
                vote_counter: 13,
              },
              {
                choice_id: 4,
                choice_text: '少ない',
                vote_counter: 16,
              },
            ],
          },
          textAnswers: [],
        },
      ],
    },
  })
  findAll(): Promise<Choice[]> {
    return this.choicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'IDによる選択肢の取得',
    description: 'IDによって特定の選択肢を取得します。',
  })
  @ApiParam({ name: 'id', description: '取得する選択肢のID' })
  @ApiResponse({
    status: 200,
    description: '選択肢が正常に取得されました。',
    schema: {
      example: {
        choice_id: 1,
        choice_text: '選択肢1',
        vote_counter: 0,
        TextAnswers: [],
      },
    },
  })
  findOne(@Param('id') id: number): Promise<Choice> {
    return this.choicesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新規選択肢の作成',
    description: 'システム内に新しい選択肢を作成します。',
  })
  @ApiBody({
    schema: {
      example: {
        choice_text: 'choice 3',
        vote_counter: 0,
        question: {
          question_id: 1,
        },
      },
    },
    description: '作成する選択肢の詳細',
  })
  @ApiResponse({
    status: 201,
    description: '選択肢が正常に作成されました。',
    schema: {
      example: {
        choice_text: 'choice 3',
        vote_counter: 0,
        question: {
          question_id: 1,
        },
        choice_id: 3,
      },
    },
  })
  create(@Body() createChoiceDto: CreateChoiceDto): Promise<Choice> {
    return this.choicesService.create(createChoiceDto);
  }

  @Patch(':id/vote')
  @ApiOperation({
    summary: '選択肢の投票',
    description: '選択肢に投票します。',
  })
  @ApiParam({ name: 'id', description: '投票する選択肢のID' })
  @ApiResponse({
    status: 200,
    description: '選択肢が正常に投票されました。',
    schema: {
      example: {
        choice_id: 1,
        choice_text: '選択肢1',
        vote_counter: 1,
      },
    },
  })
  vote(@Param('id') id: number): Promise<Choice> {
    return this.choicesService.vote(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'IDによる選択肢の削除',
    description: 'IDによって特定の選択肢を削除します。',
  })
  @ApiParam({ name: 'id', description: '削除する選択肢のID' })
  @ApiResponse({
    status: 200,
    description: '選択肢が正常に削除されました。',
  })
  @ApiResponse({ status: 404, description: '選択肢が見つかりません。' })
  remove(@Param('id') id: number) {
    return this.choicesService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'IDによる選択肢の更新',
    description: 'IDによって特定の選択肢を更新します。',
  })
  @ApiParam({ name: 'id', description: '更新する選択肢のID' })
  @ApiBody({
    schema: {
      example: {
        choice_id: 1,
        choice_text: 'choice 10',
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
    },
    description: '更新する選択肢の詳細',
  })
  @ApiResponse({
    status: 200,
    description: '選択肢が正常に更新されました。',
    schema: {
      example: {
        choice_id: 1,
        choice_text: 'choice 10',
        vote_counter: 3,
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
    },
  })
  update(
    @Param('id') id: number,
    @Body() updateChoiceDto: UpdateChoiceDto,
  ): Promise<Choice> {
    return this.choicesService.update(id, updateChoiceDto);
  }
}
