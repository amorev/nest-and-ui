import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

@Module({
  imports: [
      ConfigModule.load(
          path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'),
          {
              path: path.resolve(__dirname, '..', '.env')
          }
      )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
