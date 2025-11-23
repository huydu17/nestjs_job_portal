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
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackagesService } from './packages.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponsePackage } from './dto/response-package.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Master Data')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packageService: PackagesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new service package (Admin only)' })
  @ResponseMessage('Package created successfully')
  @ApiResponse({ status: 201, description: 'Package created.' })
  async create(@Body() createPackageDto: CreatePackageDto) {
    return await this.packageService.create(createPackageDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all packages (Admin view - including inactive)',
  })
  @ApiResponse({ status: 200, description: 'Full list of packages.' })
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.packageService.findAll(query);
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Get list of active packages (Pricing Page)' })
  @ApiResponse({
    status: 200,
    description: 'List of active packages for purchase.',
  })
  async findActivePackages(@Query() query: PaginationQueryDto) {
    return await this.packageService.findActivePackages(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get package details (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Package details.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.packageService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update package details (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Package updated successfully')
  @Serialize(ResponsePackage)
  @ApiResponse({ status: 200, description: 'Package updated.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete/Deactivate package (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Package deleted successfully')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.packageService.remove(id);
  }
}
