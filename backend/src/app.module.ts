import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.load(
            path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'),
            {
                path: path.resolve(__dirname, '..', '.env')
            }
        ),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => {
                return {
                    ...config.get('database'),
                    entities: [path.resolve(__dirname + '/../dist/**/*.entity{.ts,.js}')],
                    synchronize: true
                };
            },
            inject: [ConfigService],
        }),
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
