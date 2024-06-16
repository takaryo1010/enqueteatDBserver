import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { CsrfTokenRequest } from 'csurf';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('csrf-token')
  getCsrfToken(@Req() request: CsrfTokenRequest): any {
    // CSRFトークンを生成してレスポンスする
    return { csrfToken: request.csrfToken() };
  }
}
