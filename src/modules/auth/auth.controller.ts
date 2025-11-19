import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  @ResponseMessage('Register Successfully')
  @Serialize(ResponseAuthDto)
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login Successfully')
  @Serialize(ResponseAuthDto)
  signIn(@CurrentUser() user: AuthUser) {
    return this.authService.signIn(user);
  }

  @Post('refresh-token')
  @UseGuards(RefreshAuthGuard)
  refreshToken(@CurrentUser() user: AuthUser) {
    return this.authService.signIn(user);
  }
  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  async signOut(@CurrentUser() user: AuthUser) {
    await this.authService.signOut(user.id);
    return {
      message: 'Logged out successfully',
    };
  }
  @Get('profile')
  getProfile(@CurrentUser() user: AuthUser) {
    throw new BadRequestException('User not found');
    return user;
  }
}
