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
          choice_text: '選択肢1',
          vote_counter: 1,
          question: {
            question_id: 1,
            question_text: 'クエスチョンテキスト1',
            form: {
              form_id: 1,
              form_title: 'サンプルフォームタイトル1',
            },
            choices: [
              {
                choice_id: 1,
                choice_text: '選択肢1',
                vote_counter: 1,
              },
              {
                choice_id: 2,
                choice_text: '選択肢2',
                vote_counter: 0,
              },
            ],
          },
        },
        {
          choice_id: 2,
          choice_text: 'choice 2',
          vote_counter: 0,
          question: {
            question_id: 1,
            question_text: 'クエスチョンテキスト1',
            form: {
              form_id: 1,
              form_title: 'サンプルフォームタイトル1',
            },
            choices: [
              {
                choice_id: 1,
                choice_text: '選択肢1',
                vote_counter: 1,
              },
              {
                choice_id: 2,
                choice_text: '選択肢2',
                vote_counter: 0,
              },
            ],
          },
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
  @ApiBody({
    schema: {
      example: {
        vote_counter: 1,
      },
    },
    description: '投票する選択肢の詳細',
  })
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
  vote(
    @Param('id') id: number,
    @Body() updateChoiceDto: UpdateChoiceDto,
  ): Promise<Choice> {
    return this.choicesService.vote(id, updateChoiceDto);
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
}
