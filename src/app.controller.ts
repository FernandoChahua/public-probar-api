import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  async getHello(): Promise<any> {
    return { message: 'Hello api is up!! 🎇🎆🎇' };
  }
}
