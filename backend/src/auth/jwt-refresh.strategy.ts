import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const token = req.body.token;
          console.log({ token });
          return token;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: jwtConstants.refreshSecret,
    });
  }

  async validate(req: Request, payload: any) {
    return this.userService.getUserIfRefreshTokenMatches(
      req.body.token,
      payload.sub,
    );
  }
}
