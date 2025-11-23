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
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
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
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Master Data')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new language (Admin only)' })
  @ResponseMessage('Language created successfully')
  @ApiResponse({ status: 201, description: 'Language created.' })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get list of all languages' })
  @ApiResponse({ status: 200, description: 'Return list of languages.' })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get language details' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Return language details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.languagesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update language (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Language updated successfully')
  @ApiResponse({ status: 200, description: 'Language updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete language (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Language deleted successfully')
  @ApiResponse({ status: 200, description: 'Language deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.languagesService.remove(id);
  }
}
