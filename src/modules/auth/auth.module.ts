import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, JwtRtStrategy, LocalStrategy } from './strategies';
import jwtConfig from 'src/configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { UserModule } from '@users/user.module';
import { RedisModule } from 'src/redis/redis.module';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { RolesModule } from '@roles/roles.module';
import { PackagesModule } from '../packages/packages.module';
import { OrdersModule } from '../orders/orders.module';
import { RecruiterPackagesModule } from '../recruiter-packages/recruiter-packages.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    RedisModule,
    UserRolesModule,
    RolesModule,
    PackagesModule,
    OrdersModule,
    RecruiterPackagesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRtStrategy,
    GenerateTokensProvider,
    BcryptProvider,
    RefreshTokenProvider,
  ],
})
export class AuthModule {}
