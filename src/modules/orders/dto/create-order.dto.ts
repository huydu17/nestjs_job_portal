import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  packageId: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalPrice: number;
}
