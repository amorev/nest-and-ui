import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

class Crypt {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(
        hashFromDb: string,
        password: string,
    ): Promise<boolean> {
        return new Promise((resolve) => {
            bcrypt.compare(password, hashFromDb, (err, res) => {
                resolve(res === true);
            });
        });
    }
}


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async getUserCount(): Promise<number> {
        return this.usersRepository.count();
    }

    async findOne(username: string): Promise<any | undefined> {
        return this.usersRepository.findOne({
            username,
        });
    }

    async validateUser(user: User, password: string) {
        return Crypt.comparePassword(user.password, password);
    }


    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        return await this.usersRepository.update(userId, {
            refreshToken: currentHashedRefreshToken,
        });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.usersRepository.findOne({ id: userId });

        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (isRefreshTokenMatching) {
            return user;
        }
    }

    async createUser(username: string, password: string) {
        return this.usersRepository.save([
            {
                username,
                password: await Crypt.hashPassword(password),
            },
        ]);
    }
}
