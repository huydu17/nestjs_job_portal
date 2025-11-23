/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { UserPayload } from '@auth/interfaces/user-payload.interface';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/configs/jwt.config';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  private async signToken<T>(userId: number, expiresIn: string, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
  public async generateAccessToken(user: UserPayload): Promise<string> {
    return await this.signToken<Partial<UserPayload>>(
      user.sub,
      this.jwtConfiguration.accessTokenTtl,
      {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    );
  }
  public async generateRefreshToken(userId: number): Promise<string> {
    return await this.signToken(userId, this.jwtConfiguration.refreshTokenTtl);
  }

  public decodeJwt(token: string) {
    return this.jwtService.decode(token) as { exp: number };
  }
}
