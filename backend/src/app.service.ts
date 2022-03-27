import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { UsersService } from './users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileElement } from './file/fileElement.entity';
import { Repository } from 'typeorm';
import { User } from './users/users.entity';

@Injectable()
export class AppService {
    constructor(
        @InjectConfig() private readonly config,
        @InjectRepository(FileElement)
        private fileRepository: Repository<FileElement>,
        private userService: UsersService,
    ) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    // This method just make users count request. If database not work it will throw error
    async checkDatabaseConnection(): Promise<boolean> {
        await this.userService.getUserCount();
        return true;
    }

    async fillTestData() {
        await this.userService.createUser('manager', 'manager');
    }

    async uploadFile(file: Express.Multer.File, userId): Promise<FileElement> {
        let fileEl = new FileElement();
        fileEl.filename = file.filename;
        fileEl.originalFileName = file.originalname;
        fileEl.size = file.size;
        fileEl.userId = userId;
        const fileElement = await this.fileRepository.save(fileEl);

        return fileElement;
    }

    async fileList(userId: number): Promise<FileElement[]> {
        return this.fileRepository.find({
            where: {
                userId
            }
        });
    }

    async getFile(fileId: number, userId: number): Promise<FileElement> {
        return this.fileRepository.findOne({
            where: {
                id: fileId,
                userId
            }
        })
    }
}
