import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PackagesModule } from '../packages/packages.module';
import { UserModule } from '@users/user.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PackagesModule,
    UserModule,
    PaginationModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
