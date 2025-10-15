import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoint de prueba para Sentry
  @Get('/test-error')
  getError(): void {
    throw new Error('My first Sentry error!');
  }
  /*@Get('test-error')
  testError(): never {
    throw new Error('Error de prueba para Sentry');
  }*/

  // Health check endpoint
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
