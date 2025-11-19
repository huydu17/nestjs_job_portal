/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './interfaces/user-payload.interface';
import { hashPassword } from 'src/common/utils/crypto.util';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { ITokenResponse } from './interfaces/token-response.interface';
import { BcryptProvider } from './providers/bcrypt.provider';
import { sanitizeUser } from 'src/common/utils/sanitize-user.util';
import { UserService } from '@users/user.service';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { User } from '@users/entities/user.entity';
import { RolesService } from '@roles/roles.service';
import { Role } from '@roles/enums/role.enum';
import { UserRolesService } from '../user-roles/user-roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private genrateTokensProvider: GenerateTokensProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly bcryptProvider: BcryptProvider,
    private readonly roleService: RolesService,
    private readonly userRoleService: UserRolesService,
  ) {}
  async signUp(data: CreateUserDto) {
    const { name, email, password } = data;
    const existingUser: User | null = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const hash = hashPassword(password);
    const user = await this.userService.create({
      name,
      email,
      password: hash,
    });
    const role = await this.roleService.getRoleByName(Role.CANDIDATE);
    if (role) {
      await this.userRoleService.assignRoleToUser(
        {
          userId: user.id,
          roleIds: [role.id],
        },
        user.id,
      );
    }
    const userRoles = await this.userRoleService.getUserRoles(user.id);
    const roles = userRoles.map((ur) => ur.name);
    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles,
    };
    const accessToken =
      await this.genrateTokensProvider.generateAccessToken(payload);
    const refreshToken = await this.genrateTokensProvider.generateRefreshToken(
      user.id,
    );
    await this.refreshTokenProvider.saveTokenToRedis(user.id, refreshToken);
    return { user, accessToken, refreshToken };
  }

  async signIn(user: AuthUser) {
    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };
    const accessToken =
      await this.genrateTokensProvider.generateAccessToken(payload);
    const refreshToken = await this.genrateTokensProvider.generateRefreshToken(
      user.id,
    );
    await this.refreshTokenProvider.saveTokenToRedis(user.id, refreshToken);
    return { user, accessToken, refreshToken };
  }
  async signOut(userId: number) {
    await this.refreshTokenProvider.deleteTokenFromRedis(userId);
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const userRoles = await this.userRoleService.getUserRoles(user.id);
      const roles = userRoles.map((ur) => ur.name);
      return sanitizeUser(user, roles);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async validateRefreshToken(payload: UserPayload, refreshToken: string) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const refreshTokenHash = await this.refreshTokenProvider.getTokenFromRedis(
      payload.sub,
    );
    if (!refreshTokenHash) {
      throw new UnauthorizedException('Access Denied: Refresh token not found');
    }
    const isMatch = await this.bcryptProvider.compare(
      refreshToken,
      refreshTokenHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Access Denied: Invalid refresh token');
    }
    const userRoles = await this.userRoleService.getUserRoles(user.id);
    const roles = userRoles.map((ur) => ur.name);
    return sanitizeUser(user, roles);
  }
}
