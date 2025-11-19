import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@users/entities/user.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.orderService.create(createOrderDto, currentUser.id);
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.orderService.getAll(query);
  }

  @Get('my')
  async findMyOrders(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.orderService.getMyOrders(query, currentUser);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.getOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    await this.orderService.remove(id, currentUser);
  }
}
