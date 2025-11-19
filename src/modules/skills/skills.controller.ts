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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':skillId')
  findOne(@Param('skillId', ParseIntPipe) skillId: number) {
    return this.skillsService.findOne(skillId);
  }

  @Patch(':skillId')
  update(
    @Param('skillId', ParseIntPipe) skillId: number,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillsService.update(skillId, updateSkillDto);
  }

  @Delete(':skillId')
  remove(@Param('skillId', ParseIntPipe) skillId: number) {
    return this.skillsService.remove(skillId);
  }
}
