import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api/status')
  Status(): string {
    return `status: OK`;
  }
}
