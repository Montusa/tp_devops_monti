import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatosModule } from './platos/platos.module';

@Module({
  imports: [PlatosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
