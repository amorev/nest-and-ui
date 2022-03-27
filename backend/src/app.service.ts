import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
      @InjectConfig() private readonly config,
      private userService: UsersService,
  ) {
  }
  getHello(): string {
    return 'Hello World!';
  }

  // This method just make users count request. If database not work it will throw error
  async checkDatabaseConnection (): Promise<boolean> {
    await this.userService.getUserCount()
    return true;
  }
  async fillTestData() {
    await this.userService.createUser('manager', 'manager')
  }
}
