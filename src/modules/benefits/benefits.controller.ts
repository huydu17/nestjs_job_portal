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

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  @Get()
  findAll() {
    return this.benefitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBenefitDto: UpdateBenefitDto,
  ) {
    return this.benefitsService.update(+id, updateBenefitDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsService.remove(+id);
  }
}
