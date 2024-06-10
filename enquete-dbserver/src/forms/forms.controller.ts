import { Controller, Get, Post, Delete, Param, Body,Patch } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateFormDto } from './dto/update-form.dto';

@Controller('forms')
@ApiTags('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  @ApiOperation({
    summary: '全てのフォームを取得',
    description: 'システム内の全てのフォームのリストを取得します。',
  })
  @ApiResponse({
    status: 200,
    description: 'フォームのリストが正常に取得されました。',
    isArray: true,
    schema: {
      example: [
        {
          form_id: 1,
          form_title: 'サンプルフォームタイトル1',
        },
        {
          form_id: 2,
          form_title: 'サンプルフォームタイトル2',
        },
      ],
    },
  })
  findAll(): Promise<Form[]> {
    return this.formsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'IDによるフォームの取得',
    description: 'IDによって特定のフォームを取得します。',
  })
  @ApiParam({ name: 'id', description: '取得するフォームのID' })
  @ApiResponse({
    status: 200,
    description: 'フォームが正常に取得されました。',
    schema: {
      example: {
        form_id: 1,
        form_title: 'サンプルフォームタイトル1',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'フォームが見つかりません。' })
  findOne(@Param('id') id: number): Promise<Form> {
    return this.formsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '新規フォームの作成',
    description: 'システム内に新しいフォームを作成します。',
  })
  @ApiBody({
    schema: {
      example: {
        form_title: 'フォームのタイトル2',
      },
    },
    description: '作成するフォームの詳細',
  })
  @ApiResponse({
    status: 201,
    description: 'フォームが正常に作成されました。',
    schema: {
      example: {
        form_title: 'サンプルフォームタイトル1',
        form_id: 1,
      },
    },
  })
  create(@Body() form: Form): Promise<Form> {
    return this.formsService.create(form);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'IDによるフォームの削除',
    description: '一意の識別子によって特定のフォームを削除します。',
  })
  @ApiParam({ name: 'id', description: '削除するフォームのID' })
  @ApiResponse({ status: 200, description: 'フォームが正常に削除されました。' })
  @ApiResponse({ status: 404, description: 'フォームが見つかりません。' })
  remove(@Param('id') id: number): Promise<void> {
    return this.formsService.remove(id);
  }


  @Patch(':id')
  @ApiOperation({
    summary: 'IDによるフォームタイトルの更新',
    description: 'IDによって特定のフォームを更新します。',
  })
  @ApiParam({ name: 'id', description: '更新するフォームのID' })
  @ApiBody({
    schema: {
      example: {
        form_title: 'フォームのタイトル2',
      },
    },
    description: '更新するフォームの詳細',
  })
  @ApiResponse({
    status: 200,
    description: 'フォームが正常に更新されました。',
    schema: {
      example: {
        form_title: 'サンプルフォームタイトル1',
        form_id: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'フォームが見つかりません。' })
  update(@Param('id') id: number, @Body() form: UpdateFormDto): Promise<Form> {
    return this.formsService.update(id, form);
  }

}
