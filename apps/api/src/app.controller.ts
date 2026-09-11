import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'VASUNDHARA API',
      version: '1.0.0',
      status: 'running',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'vasundhara-api',
      timestamp: new Date().toISOString(),
    };
  }
}
