/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/modules/payment/payment.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { RecruiterPackagesService } from '../recruiter-packages/recruiter-packages.service';
import {
  buildVnpDate,
  createPaymentUrl,
  verifyVnpQuery,
} from 'src/common/utils/vnpay';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { DataSource } from 'typeorm';
import appConfig from 'src/configs/app.config';

@Injectable()
export class PaymentService {
  constructor(
    private ordersService: OrdersService,
    private recruiterPackagesService: RecruiterPackagesService,
    private dataSource: DataSource,
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  async createVnpayUrl(packageId: number, ipAddr: string, userId: number) {
    const order = await this.ordersService.create(packageId, userId);
    const txnRef = order?.id.toString();
    const amount = Number(order?.totalPrice);
    const vnpParams: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.vnpTmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Order ${txnRef}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: this.config.vnpReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: buildVnpDate(new Date()),
    };
    const paymentUrl = createPaymentUrl(vnpParams);
    return { paymentUrl, txnRef, orderId: order?.id };
  }

  async vnpIpn(query: any) {
    const valid = verifyVnpQuery(query as Record<string, any>);
    if (!valid) {
      return { RspCode: '97', Message: 'Checksum failed' };
    }
    const { vnp_ResponseCode, vnp_TxnRef, vnp_Amount } = query as unknown as {
      vnp_ResponseCode: string;
      vnp_TxnRef: string;
      vnp_Amount: string;
    };
    try {
      const order = await this.ordersService.getOne(Number(vnp_TxnRef));
      if (order.status === OrderStatus.SUCCESS) {
        return { RspCode: '00', Message: 'OK' };
      }
      if (vnp_ResponseCode === '00') {
        const amountToGateway = Number(vnp_Amount) / 100;
        if (amountToGateway !== Number(order.totalPrice)) {
          return { RspCode: '04', Message: 'Invalid amount' };
        }
        await this.dataSource.manager.transaction(
          async (transactionalEntityManager) => {
            await this.recruiterPackagesService.create(
              {
                packageId: order.packageId,
              },
              order.recruiterId,
              transactionalEntityManager,
            );
            await this.ordersService.updateStatus(
              order.id,
              {
                status: OrderStatus.SUCCESS,
              },
              transactionalEntityManager,
            );
          },
        );
        return { RspCode: '00', Message: 'OK', orderId: order.id };
      }
      await this.ordersService.updateStatus(order.id, {
        status: OrderStatus.FAILED,
      });
      return { RspCode: '00', Message: 'Failed' };
    } catch (err) {
      return { RspCode: '01', Message: 'Order not found' };
    }
  }

  vnpReturn(query: any) {
    const valid = verifyVnpQuery(query as Record<string, any>);
    const code = (query as any).vnp_ResponseCode;
    const txnRef = (query as any).vnp_TxnRef;
    const success = valid && code === '00';
    return { success, orderId: txnRef };
  }
}
