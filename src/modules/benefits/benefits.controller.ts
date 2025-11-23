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
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiTags('Master Data')
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new benefit (Admin only)' })
  @ApiResponse({ status: 201, description: 'Benefit created successfully.' })
  @ResponseMessage('Benefit created successfully.')
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get list of all benefits (Public)' })
  @ApiResponse({ status: 200, description: 'Return all benefits.' })
  @ResponseMessage('Return all benefits.')
  findAll() {
    return this.benefitsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get benefit details (Public)' })
  @ApiResponse({ status: 200, description: 'Return benefit details.' })
  @ResponseMessage('Return all benefits.')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update benefit (Admin only)' })
  @ApiResponse({ status: 200, description: 'Benefit updated successfully.' })
  @ResponseMessage('Benefit updated successfully.')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBenefitDto: UpdateBenefitDto,
  ) {
    return this.benefitsService.update(+id, updateBenefitDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete benefit (Admin only)' })
  @ApiResponse({ status: 200, description: 'Benefit deleted successfully.' })
  @ResponseMessage('Benefit deleted successfully.')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsService.remove(+id);
  }
}
