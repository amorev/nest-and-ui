import {
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Response,
    UseInterceptors,
    UploadedFiles,
    Res,
    StreamableFile
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './auth/jwt-refresh.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { createReadStream } from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

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
    async checkLogin(@Request() req) {
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
    @UseInterceptors(FilesInterceptor('files', 10,{
        storage,
        limits: {
            fileSize: 5242880
        }
    }))
    async upload(@UploadedFiles() files: Express.Multer.File[], @Request() req) {
        const result = [];
        console.log(files);
        for (let file of files)
            result.push(await this.appService.uploadFile(file, req.user.userId));
        return result;
    }

    @Get('/filelist')
    @UseGuards(JwtAuthGuard)
    filelist(@Request() req) {
        return this.appService.fileList(req.user.userId);
    }

    @Get('/download')
    @UseGuards(JwtAuthGuard)
    async download(@Request() req, @Response({passthrough: true}) res) {
        const fileEl = await this.appService.getFile(req.query.id, req.user.userId);
        let strings = fileEl.originalFileName.split('.');
        const extension = strings[strings.length - 1];
        let s = 'attachment; filename="' + fileEl.filename + '.' + extension + '"';
        res.set({
            'Content-Disposition': s,
        });
        const file = createReadStream('./uploads/' + fileEl.filename);
        return new StreamableFile(file);
    }
}
