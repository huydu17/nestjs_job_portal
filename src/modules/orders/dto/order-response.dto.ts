/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform } from 'class-transformer';
import { OrderStatus } from 'src/common/enums/order-status.enum';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  totalPrice: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.package?.id)
  packageId: number;

  @Expose()
  @Transform(({ obj }) => obj.package?.label)
  packageName: string;

  @Expose()
  @Transform(({ obj }) => obj.package?.duration)
  duration: number;

  @Expose()
  @Transform(({ obj }) => obj.recruiter?.id)
  recruiterId: number;

  @Expose()
  @Transform(({ obj }) => obj.recruiter?.email)
  recruiterEmail: string;

  @Expose()
  @Transform(({ obj }) => obj.recruiter?.name)
  recruiterName: string;
}
