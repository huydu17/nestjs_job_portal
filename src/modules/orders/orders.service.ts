/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './entities/order.entity';
import { User } from '@users/entities/user.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { UserService } from '@users/user.service';
import { PackagesService } from '../packages/packages.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userSerivce: UserService,
    private packageService: PackagesService,
    private paginationService: PaginationService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const { packageId, totalPrice } = createOrderDto;
    await this.packageService.findOneActivePackage(packageId);
    await this.userSerivce.findById(userId);
    const order = await this.orderRepository.save({
      recruiterId: userId,
      packageId,
      totalPrice,
      status: OrderStatus.PENDING,
    });
    return order;
  }

  async getAll(query: PaginationQueryDto) {
    const { filter } = query;
    const condition: any = {
      relations: ['recruiter', 'package'],
      order: { orderDate: 'DESC' },
    };
    if (filter) {
      condition.where.package = { label: Like(`%${filter}%`) };
    }
    const orders = await this.paginationService.paginateQuery(
      query,
      this.orderRepository,
      condition,
    );
    return orders;
  }

  async getMyOrders(query: PaginationQueryDto, currentUser: any) {
    const { filter } = query;
    const condition: any = {
      where: { recruiterId: currentUser.id },
      relations: ['recruiter', 'package'],
      order: { orderDate: 'DESC' },
    };
    if (filter) {
      condition.where.package = { label: Like(`%${filter}%`) };
    }
    const orders = await this.paginationService.paginateQuery(
      query,
      this.orderRepository,
      condition,
    );
    return orders;
  }

  async getOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['recruiter', 'package'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    await this.getOne(id);
    const updatedOrder = await this.orderRepository.save({
      id,
      status: updateOrderStatusDto.status,
    });
    return updatedOrder;
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id, recruiter: { id: currentUser.id } },
    });

    if (!order) {
      throw new NotFoundException(
        `Order not found or you do not have permission to delete it`,
      );
    }
    await this.orderRepository.delete(id);
  }
}
