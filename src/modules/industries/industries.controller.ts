import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Role } from '@roles/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Master Data')
@Controller('industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new industry (Admin only)' })
  @ResponseMessage('Industry created successfully')
  @ApiResponse({ status: 201, description: 'Industry created.' })
  create(@Body() createIndustryDto: CreateIndustryDto) {
    return this.industriesService.create(createIndustryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get list of all industries' })
  @ApiResponse({ status: 200, description: 'Return list of industries.' })
  findAll() {
    return this.industriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get industry details' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Return industry details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.industriesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update industry (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Industry updated successfully')
  @ApiResponse({ status: 200, description: 'Industry updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ) {
    return this.industriesService.update(id, updateIndustryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete industry (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Industry deleted successfully')
  @ApiResponse({ status: 200, description: 'Industry deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.industriesService.remove(id);
  }
}
