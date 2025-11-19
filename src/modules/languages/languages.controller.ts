import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('languages')
@UseGuards(JwtAuthGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':languageId')
  findOne(@Param('languageId', ParseIntPipe) languageId: number) {
    return this.languagesService.findOne(languageId);
  }

  @Patch(':languageId')
  update(
    @Param('languageId', ParseIntPipe) languageId: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(languageId, updateLanguageDto);
  }

  @Delete(':languageId')
  remove(@Param('languageId', ParseIntPipe) languageId: number) {
    return this.languagesService.remove(languageId);
  }
}
