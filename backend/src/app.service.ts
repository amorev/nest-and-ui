import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';

@Injectable()
export class AppService {
  constructor(
      @InjectConfig() private readonly config
  ) {
  }
  getHello(): string {
    return 'Hello World!';
  }

  // Simple method for check, that dotenv and config are connected successfully
  async checkDatabaseConnection (): Promise<boolean> {
    const config = this.config.get('database.host');
    console.log({ config });
    return true;
  }
}
