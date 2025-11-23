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
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Master Data')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new skill (Admin only)' })
  @ResponseMessage('Skill created successfully')
  @ApiResponse({ status: 201, description: 'Skill created.' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get list of all skills' })
  @ApiResponse({ status: 200, description: 'Return list of skills.' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':skillId')
  @Public()
  @ApiOperation({ summary: 'Get skill details' })
  @ApiParam({ name: 'skillId', example: 1 })
  @ApiResponse({ status: 200, description: 'Return skill details.' })
  @ResponseMessage('Get skill successfully')
  findOne(@Param('skillId', ParseIntPipe) skillId: number) {
    return this.skillsService.findOne(skillId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update skill (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Skill updated successfully')
  @ApiResponse({ status: 200, description: 'Skill updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete skill (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Skill deleted successfully')
  @ApiResponse({ status: 200, description: 'Skill deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }
}
