/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/payment/payment.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  Inject,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request, Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorator';
import appConfig from 'src/configs/app.config';
import type { ConfigType } from '@nestjs/config';

@ApiTags('Payment')
@Controller('payments/vnpay')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  @Post('create-url')
  @Roles(Role.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create VNPay Payment URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        packageId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Return VNPay URL & Order Info.' })
  async createUrl(
    @Body('packageId') packageId: number,
    @Req() req: Request,
    @CurrentUser() currentUser: AuthUser,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return await this.paymentService.createVnpayUrl(
      packageId,
      ipAddr,
      currentUser.id,
    );
  }

  @Get('ipn')
  @Public()
  @ApiOperation({ summary: 'VNPay IPN Webhook (Do not call manually)' })
  @ApiResponse({ status: 200, description: 'RspCode to VNPay.' })
  async vnpayIpn(@Query() query: any) {
    return await this.paymentService.vnpIpn(query);
  }

  @Get('return')
  @Public()
  @ApiOperation({ summary: 'VNPay Return URL (Handle Redirect)' })
  returnIpn(@Query() query: any, @Res() res: Response) {
    const { success, orderId } = this.paymentService.vnpReturn(query);
    const frontendUrl = this.config.clientUrl || 'http://localhost:3000';
    if (success) {
      return res.redirect(`${frontendUrl}/payment/success?orderId=${orderId}`);
    } else {
      return res.redirect(`${frontendUrl}/payment/failed?orderId=${orderId}`);
    }
  }
}
