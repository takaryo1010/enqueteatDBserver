import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'ユーザーの作成',
    description: '新しいユーザーを作成します。',
  })
  @ApiBody({
    schema: {
      example: {
        user_email: 'example@gmail.com',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'ユーザーが正常に作成されました。',
    schema: {
      example: {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':email')
  @ApiOperation({
    summary: 'ユーザーの取得',
    description: '指定されたメールアドレスのユーザーを取得します。',
  })
  @ApiParam({ name: 'email', description: '取得するユーザーのメールアドレス' })
  @ApiResponse({
    status: 200,
    description: 'ユーザーが正常に取得されました。',
    schema: {
      example: {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      },
    },
  })
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':email')
  @ApiOperation({
    summary: 'ユーザー情報の更新',
    description: '指定されたメールアドレスのユーザー情報を更新します。',
  })
  @ApiParam({ name: 'email', description: '更新するユーザーのメールアドレス' })
  @ApiBody({
    schema: {
      example: {
        form_id: 1,
      },

    },
  })
  @ApiResponse({
    status: 200,
    description: 'ユーザー情報が正常に更新されました。',
    schema: {
      example: {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      },
    },
  })
  addForm(@Param('email') email: string, @Body('form_id') formId: number) {
    return this.usersService.addForm(email, formId);
  }


}
