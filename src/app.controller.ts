import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('error')
  boom() {
    throw new Error('Boom! Something went wrong.');
  }
}
