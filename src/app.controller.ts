import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('status')
  getStatus(): string {
    return this.appService.getStatus();
  }
  @Post('ping')
  ping(): string {
    return 'pong';
  }
}
