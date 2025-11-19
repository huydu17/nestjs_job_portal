/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../interfaces/user-payload.interface';
import jwtConfig from 'src/configs/jwt.config';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: jwtConfiguration.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: UserPayload) {
    const user: UserPayload = payload;
    const refreshToken = req.body.refreshToken;
    return this.authService.validateRefreshToken(user, refreshToken as string);
  }
}
