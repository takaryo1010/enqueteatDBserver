import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TextAnswerService } from './text-answer.service';
import { CreateTextAnswerDto } from './dto/create-text-answer.dto';
import { UpdateTextAnswerDto } from './dto/update-text-answer.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('text-answer')
@ApiTags('textAnswer')
export class TextAnswerController {
  constructor(private readonly textAnswerService: TextAnswerService) {}

  @Post()
  @ApiOperation({
    summary: 'テキスト回答の作成',
    description: 'テキスト回答を作成します。',
  })
  @ApiBody({
    schema: {
      example: {
        text: 'テキスト回答',
        choice: { choice_id: 1 },
      },
    },
    description: 'テキスト回答の内容',
  })
  @ApiResponse({
    status: 201,
    description: 'テキスト回答が正常に作成されました。',
    schema: {
      example: {
        answer_id: 1,
        text: 'テキスト回答',
      },
    },
  })
  create(@Body() createTextAnswerDto: CreateTextAnswerDto) {
    return this.textAnswerService.create(createTextAnswerDto);
  }

  @Get()
  @ApiOperation({
    summary: '全てのテキスト回答を取得',
    description: 'システム内の全てのテキスト回答のリストを取得します。',
  })
  @ApiResponse({
    status: 200,
    description: 'テキスト回答のリストが正常に取得されました。',
    isArray: true,
    schema: {
      example: [
        {
          answer_id: 1,
          text: 'テキスト回答1',
        },
        {
          answer_id: 2,
          text: 'テキスト回答2',
        },
      ],
    },
  })
  findAll() {
    return this.textAnswerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '特定のテキスト回答を取得',
    description: '特定のテキスト回答を取得します。',
  })
  @ApiResponse({
    status: 200,
    description: 'テキスト回答が正常に取得されました。',
    schema: {
      example: {
        answer_id: 1,
        text: 'テキスト回答1',
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.textAnswerService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'テキスト回答の更新',
  //   description: 'テキスト回答を更新します。',
  // })
  // @ApiBody({
  //   schema: {
  //     example: {
  //       text: 'テキスト回答',
  //     },
  //   },
  //   description: 'テキスト回答の内容',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'テキスト回答が正常に更新されました。',
  //   schema: {
  //     example: {
  //       answer_id: 1,
  //       text: 'テキスト回答',
  //     },
  //   },
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTextAnswerDto: UpdateTextAnswerDto,
  // ) {
  //   return this.textAnswerService.update(+id, updateTextAnswerDto);
  // }

  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'テキスト回答の削除',
  //   description: 'テキスト回答を削除します。',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'テキスト回答が正常に削除されました。',
  // })
  // remove(@Param('id') id: string) {
  //   return this.textAnswerService.remove(+id);
  // }
}
