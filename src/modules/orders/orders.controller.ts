import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@users/entities/user.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@roles/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { OrderResponseDto } from './dto/order-response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @Roles(Role.RECRUITER)
  @Serialize(OrderResponseDto)
  @ApiOperation({ summary: 'Create new order (Purchase package)' })
  @ResponseMessage('Order created successfully')
  @ApiResponse({ status: 201, description: 'Order created (Pending).' })
  async create(
    @Body('packageId') packageId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.orderService.create(packageId, currentUser.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @Serialize(OrderResponseDto)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all orders.' })
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.orderService.getAll(query);
  }

  @Get('my')
  @Roles(Role.RECRUITER)
  @Serialize(OrderResponseDto)
  @ApiOperation({ summary: 'Get my order history' })
  @ApiResponse({ status: 200, description: 'List of my orders.' })
  async findMyOrders(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.orderService.getMyOrders(query, currentUser);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECRUITER)
  @Serialize(OrderResponseDto)
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'id', example: 100 })
  @ApiResponse({ status: 200, description: 'Order details.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.getOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @Serialize(OrderResponseDto)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', example: 100 })
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete order (Admin only)' })
  @ApiParam({ name: 'id', example: 100 })
  @ResponseMessage('Order deleted successfully')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    await this.orderService.remove(id, currentUser);
  }
}
