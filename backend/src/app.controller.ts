import { Controller, Get, Post, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './auth/jwt-refresh.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

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

    @Post('/upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage
    }))
    upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
        return this.appService.uploadFile(file, req.user.userId);
    }

    @Get('/filelist')
    @UseGuards(JwtAuthGuard)
    filelist() {
        return this.appService.fileList();
    }
}
