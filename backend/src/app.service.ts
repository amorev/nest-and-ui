import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { UsersService } from './users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileElement } from './file/fileElement.entity';
import { Repository } from 'typeorm';
import { User } from './users/users.entity';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @InjectConfig() private readonly config,
    @InjectRepository(FileElement)
    private fileRepository: Repository<FileElement>,
    private userService: UsersService,
  ) {}

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

  createHashFromFile = (filePath) =>
    new Promise((resolve) => {
      const hash = crypto.createHash('sha1');
      fs.createReadStream(filePath)
        .on('data', (data) => hash.update(data))
        .on('end', () => resolve(hash.digest('hex')));
    });

  async uploadFile(
    file: Express.Multer.File,
    userId,
  ): Promise<{
    element: FileElement;
    duplicate?: boolean;
  }> {
    const fileEl = new FileElement();
    const fileHash = (await this.createHashFromFile(
      './uploads/' + file.filename,
    )) as string;
    const fileByHash = await this.fileRepository.findOne({
      where: {
        fileHash,
      },
    });
    if (fileByHash) {
      return {
        element: fileByHash,
        duplicate: true,
      };
    }
    fileEl.fileHash = fileHash.toString();
    fileEl.filename = file.filename;
    fileEl.originalFileName = file.originalname;
    fileEl.size = file.size;
    fileEl.userId = userId;
    const fileElement = await this.fileRepository.save(fileEl);

    return {
      element: fileElement,
    };
  }

  async fileList(userId: number): Promise<FileElement[]> {
    return this.fileRepository.find({
      where: {
        userId,
      },
    });
  }

  async getFile(fileId: number, userId: number): Promise<FileElement> {
    return this.fileRepository.findOne({
      where: {
        id: fileId,
        userId,
      },
    });
  }
}
