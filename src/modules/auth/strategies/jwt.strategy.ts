/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../interfaces/user-payload.interface';
import jwtConfig from 'src/configs/jwt.config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: UserPayload): Promise<AuthUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const isBlackList = await this.redisService.get(`blacklist:${token}`);
    if (isBlackList) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
