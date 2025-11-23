import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Register new account' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ResponseMessage('Register Successfully')
  @Serialize(ResponseAuthDto)
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Email/Password' })
  @ApiBody({
    type: SignInDto,
    examples: {
      Admin: {
        summary: 'Admin Account',
        value: {
          email: 'admin@jobportal.com',
          password: 'Password@123',
        },
      },
      Recruiter: {
        summary: 'Recruiter Account',
        value: {
          email: 'recruiter@company.com',
          password: 'Password@123',
        },
      },
      Candidate: {
        summary: 'Candidate Account',
        value: {
          email: 'candidate@gmail.com',
          password: 'Password@123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns Access Token.',
  })
  @ResponseMessage('Login Successfully')
  @Serialize(ResponseAuthDto)
  signIn(@CurrentUser() user: AuthUser) {
    return this.authService.signIn(user);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiBearerAuth()
  @ResponseMessage('Refresh Token Successfully')
  refreshToken(@Body() token: RefreshTokenDto, @CurrentUser() user: AuthUser) {
    return this.authService.refreshTokens(user);
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout (Revoke token)' })
  @ResponseMessage('Logged out successfully')
  async signOut(
    @CurrentUser() user: AuthUser,
    @Headers('authorization') authHeader: string,
  ) {
    const accessToken = authHeader?.replace('Bearer ', '');
    await this.authService.signOut(user.id, accessToken);
  }
}
