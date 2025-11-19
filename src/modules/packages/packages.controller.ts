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
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PackagesService } from './packages.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponsePackage } from './dto/response-package.dto';

@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private readonly packageService: PackagesService) {}

  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return await this.packageService.create(createPackageDto);
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.packageService.findAll(query);
  }

  @Get('active')
  async findActivePackages(@Query() query: PaginationQueryDto) {
    return await this.packageService.findActivePackages(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.packageService.findOne(id);
  }

  @Patch(':id')
  @Serialize(ResponsePackage)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.packageService.remove(id);
    return {
      message: 'Delete package successfully',
    };
  }
}
