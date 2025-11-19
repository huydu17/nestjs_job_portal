import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCandidateLanguageDto } from './dto/create-candidate-language.dto';
import { UpdateCandidateLanguageDto } from './dto/update-candidate-language.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CandidateLanguagesService } from './candidate-languages.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('candidate-languages')
@UseGuards(JwtAuthGuard)
export class CandidateLanguagesController {
  constructor(
    private readonly candidateLanguagesService: CandidateLanguagesService,
  ) {}

  @Post()
  async create(
    @Body() createCandidateLanguageDto: CreateCandidateLanguageDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateLanguagesService.create(
      createCandidateLanguageDto,
      currentUser.id,
    );
  }

  @Get('me')
  async findMyLanguages(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateLanguagesService.findMyLanguages(currentUser.id);
  }

  @Patch(':candidateLanguageId/level')
  async updateLevel(
    @Param('candidateLanguageId', ParseIntPipe) languageId: number,
    @Body() updateCandidateLanguageDto: UpdateCandidateLanguageDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateLanguagesService.updateLevel(
      languageId,
      updateCandidateLanguageDto,
      currentUser.id,
    );
  }

  @Delete(':candidateLanguageId')
  async remove(
    @Param('candidateLanguageId', ParseIntPipe) candidateLanguageId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.candidateLanguagesService.remove(
      candidateLanguageId,
      currentUser.id,
    );
  }
}
