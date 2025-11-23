import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCandidateLanguageDto } from './dto/create-candidate-language.dto';
import { UpdateCandidateLanguageDto } from './dto/update-candidate-language.dto';
import { CandidateLanguagesService } from './candidate-languages.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
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

@ApiTags('Candidates')
@ApiBearerAuth()
@Controller('candidate-languages')
export class CandidateLanguagesController {
  constructor(
    private readonly candidateLanguagesService: CandidateLanguagesService,
  ) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Add new language skill' })
  @ResponseMessage('Language added successfully')
  @ApiResponse({ status: 201, description: 'Language record created.' })
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
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Get my language skills' })
  @ApiResponse({ status: 200, description: 'List of language records.' })
  async findMyLanguages(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateLanguagesService.findMyLanguages(currentUser.id);
  }

  @Patch(':candidateLanguageId/level')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Update language proficiency level' })
  @ApiParam({ name: 'candidateLanguageId', example: 1 })
  @ResponseMessage('Language level updated successfully')
  @ApiResponse({ status: 200, description: 'Language level updated.' })
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
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Delete language skill' })
  @ApiParam({ name: 'candidateLanguageId', example: 1 })
  @ResponseMessage('Language deleted successfully')
  @ApiResponse({ status: 200, description: 'Language record deleted.' })
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
