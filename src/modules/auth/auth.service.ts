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
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { sanitizeUser } from 'src/common/utils/sanitize-user.util';
import { UserService } from '@users/user.service';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { User } from '@users/entities/user.entity';
import { RolesService } from '@roles/roles.service';
import { Role } from '@roles/enums/role.enum';
import { UserRolesService } from '../user-roles/user-roles.service';
import { DataSource } from 'typeorm';
import { UserRole } from '../user-roles/entities/user-role.entity';
import { RedisService } from 'src/redis/redis.service';
import { PackagesService } from '../packages/packages.service';
import { OrdersService } from '../orders/orders.service';
import { RecruiterPackagesService } from '../recruiter-packages/recruiter-packages.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private genrateTokensProvider: GenerateTokensProvider,
    private refreshTokenProvider: RefreshTokenProvider,
    private bcryptProvider: BcryptProvider,
    private roleService: RolesService,
    private userRoleService: UserRolesService,
    private packagesService: PackagesService,
    private ordersService: OrdersService,
    private recruiterPackagesService: RecruiterPackagesService,
    private dataSource: DataSource,
    private redisService: RedisService,
  ) {}
  async signUp(data: CreateUserDto) {
    const { name, email, password, role } = data;

    if (role === Role.ADMIN)
      throw new BadRequestException('Cannot register as Admin');
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new BadRequestException('Email already in use');
    const hashedPassword = hashPassword(password);
    const newUser = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const savedUser = await userRepo.save(
        userRepo.create({
          name,
          email,
          password: hashedPassword,
        }),
      );
      const targetRoleName = role || Role.CANDIDATE;
      const roleEntity = await this.roleService.getRoleByName(targetRoleName);
      if (roleEntity) {
        const userRoleRepo = manager.getRepository(UserRole);
        await userRoleRepo.save({
          userId: savedUser.id,
          roleId: roleEntity.id,
        });
      }
      if (role === Role.RECRUITER) {
        await this.assignFreePackageToRecruiter(newUser.id);
      }
      return savedUser;
    });

    const payload: UserPayload = {
      sub: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roles: [role || Role.CANDIDATE],
    };
    return this.generateAuthResponse(payload);
  }

  async signIn(user: AuthUser) {
    return this.generateAuthResponse(user);
  }

  async signOut(userId: number, accessToken: string) {
    await this.refreshTokenProvider.deleteTokenFromRedis(userId);
    const decode = this.genrateTokensProvider.decodeJwt(accessToken);
    const ttl = decode.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.redisService.set(`blacklist:${accessToken}`, 'revoked', ttl);
    }
  }

  async refreshTokens(user: AuthUser) {
    return this.generateAuthResponse(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Account not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const userRoles = await this.userRoleService.getUserRoles(user.id);
    const roles = userRoles.map((ur) => ur.name);
    return sanitizeUser(user, roles);
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

  private async generateAuthResponse(payload: AuthUser | UserPayload) {
    const userId = 'sub' in payload ? payload.sub : payload.id;
    const tokenPayload: UserPayload = {
      sub: userId,
      name: payload.name,
      email: payload.email,
      roles: payload.roles,
    };
    const accessToken =
      await this.genrateTokensProvider.generateAccessToken(tokenPayload);
    const refreshToken = await this.genrateTokensProvider.generateRefreshToken(
      tokenPayload.sub,
    );
    await this.refreshTokenProvider.saveTokenToRedis(
      tokenPayload.sub,
      refreshToken,
    );
    return {
      user: {
        id: userId,
        name: tokenPayload.name,
        email: tokenPayload.email,
        roles: tokenPayload.roles,
      },
      accessToken,
      refreshToken,
    };
  }

  private async assignFreePackageToRecruiter(userId: number) {
    const freePackage = await this.packagesService.findFreeTrialPackage();
    if (freePackage) {
      await this.ordersService.create(freePackage.id, userId);
      const createPkgDto = { packageId: freePackage.id };
      await this.recruiterPackagesService.create(createPkgDto, userId);
    }
  }
}
