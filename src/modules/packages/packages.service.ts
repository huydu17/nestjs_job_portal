/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    private paginationService: PaginationService,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const formatData = {
      ...createPackageDto,
    };
    return await this.packageRepository.save(formatData);
  }

  async findAll(query: PaginationQueryDto) {
    const { filter } = query;
    const condition: any = { where: {} };
    if (filter) {
      condition.where.label = Like(`%${filter}%`);
    }
    const packages = await this.paginationService.paginateQuery(
      query,
      this.packageRepository,
      condition,
    );
    return packages;
  }

  async findActivePackages(query: PaginationQueryDto) {
    const { filter } = query;
    const condition: any = {
      where: { isActive: true },
      order: { price: 'ASC' },
    };
    if (filter) {
      condition.where.label = Like(`%${filter}%`);
    }
    const packages = await this.paginationService.paginateQuery(
      query,
      this.packageRepository,
      condition,
      'package:active',
      3600,
    );
    return packages;
  }

  async findOne(id: number): Promise<Package> {
    const packageEntity = await this.packageRepository.findOne({
      where: { id },
    });
    if (!packageEntity) {
      throw new NotFoundException(`Package not found`);
    }
    return packageEntity;
  }

  async findOneActivePackage(id: number): Promise<Package> {
    const packageEntity = await this.packageRepository.findOne({
      where: { id, isActive: true },
    });
    if (!packageEntity) {
      throw new NotFoundException(`Package not found`);
    }
    return packageEntity;
  }

  async update(
    id: number,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const packages = await this.findOne(id);
    Object.assign(packages, updatePackageDto);
    return await this.packageRepository.save(packages);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.packageRepository.delete(id);
  }

  async findFreeTrialPackage() {
    return await this.packageRepository.findOne({
      where: { price: 0, isActive: true },
    });
  }
}
