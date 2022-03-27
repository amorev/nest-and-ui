import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        public usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await this.usersService.validateUser(user, pass))) {
            const {...result} = user;
            return result;
        }
        return null;
    }

    expireTimeAccess = 60 * 60 * 24 * 3;
    expireTimeRefresh = 60 * 60 * 24 * 14;

    makeRefreshToken(user: User) {
        const payload = {username: user.username, sub: user.id};
        return this.jwtService.sign(payload, {
            secret: jwtConstants.refreshSecret,
            expiresIn: this.expireTimeRefresh,
        });
    }

    async login(user: User) {
        try {
            return this.createAccessToken(user);
        } catch (e) {
            this.logger.error('Auth error: ' + e);
            throw new Error("Auth error");
        }
    }

    async signup(userInfo: {
        username: string,
        password: string
    }) {
        try {
            const [user] = await this.usersService.createUser(userInfo.username, userInfo.password);
            return this.createAccessToken(user);
        } catch (e) {
            this.logger.error('Auth error: ' + e);
            throw new Error("Signup error");
        }
    }

    private async createAccessToken(user: { password: string; username: string } & User) {
        const payload = {username: user.username, sub: user.id};
        const refreshToken = this.makeRefreshToken(user);
        await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
            expireTime: this.expireTimeAccess,
        };
    }

    async refreshToken(user: User) {
        const payload = {username: user.username, sub: user.id};

        const refreshToken = await this.makeRefreshToken(user);
        await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
            expireTime: this.expireTimeRefresh,
        };
    }
}
