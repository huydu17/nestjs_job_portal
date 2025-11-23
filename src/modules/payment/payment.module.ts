import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { RecruiterPackagesModule } from '../recruiter-packages/recruiter-packages.module';

@Module({
  imports: [OrdersModule, RecruiterPackagesModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
