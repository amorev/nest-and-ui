import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './auth/jwt-refresh.guard';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly authService: AuthService) {
    }

    @Get('/testData')
    testData() {
        return this.appService.fillTestData();
    }

    @Post('/auth/login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('/auth/signup')
    async signup(@Request() req) {
        return this.authService.signup(req.body);
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/checkAuth')
    @UseGuards(JwtAuthGuard)
    async checkLogin(@Request() req){
        return req.user;
    }

    @Get('/databaseConnected')
    async getIsDatabaseConnected(): Promise<boolean> {
        return this.appService.checkDatabaseConnection();
    }

    @Post('/auth/refresh-token')
    @UseGuards(JwtRefreshAuthGuard)
    refreshToken(@Request() req): any {
        return this.authService.refreshToken(req.user);
    }
}
