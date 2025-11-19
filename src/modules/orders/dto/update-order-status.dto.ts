import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/common/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
