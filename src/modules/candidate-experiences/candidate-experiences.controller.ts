/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateCandidateExperienceDto } from './dto/create-candidate-experience.dto';
import { UpdateCandidateExperienceDto } from './dto/update-candidate-experience.dto';
import { CandidateExperiencesService } from './candidate-experiences.service';
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
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CandidateExperienceResponseDto } from './dto/experience-response.dto';

@ApiTags('Candidates')
@ApiBearerAuth()
@Controller('candidate-experiences')
export class CandidateExperiencesController {
  constructor(
    private readonly candidateExperiencesService: CandidateExperiencesService,
  ) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateExperienceResponseDto)
  @ApiOperation({ summary: 'Add new work experience' })
  @ResponseMessage('Experience added successfully')
  @ApiResponse({ status: 201, description: 'Experience record created.' })
  async create(
    @Body() createCandidateExperienceDto: CreateCandidateExperienceDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateExperiencesService.create(
      createCandidateExperienceDto,
      currentUser.id,
    );
  }

  @Get('me')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateExperienceResponseDto)
  @ApiOperation({ summary: 'Get my work experience history' })
  @ApiResponse({ status: 200, description: 'List of experience records.' })
  async findMyExperiences(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateExperiencesService.findMyExperiences(
      currentUser.id,
    );
  }

  @Patch(':candidateExperienceId')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateExperienceResponseDto)
  @ApiOperation({ summary: 'Update experience details' })
  @ApiParam({ name: 'candidateExperienceId', example: 1 })
  @ResponseMessage('Experience updated successfully')
  @ApiResponse({ status: 200, description: 'Experience record updated.' })
  async update(
    @Param('candidateExperienceId') candidateExperienceId: number,
    @Body() updateCandidateExperienceDto: UpdateCandidateExperienceDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateExperiencesService.update(
      candidateExperienceId,
      updateCandidateExperienceDto,
      currentUser.id,
    );
  }

  @Delete(':candidateExperienceId')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Delete experience record' })
  @ApiParam({ name: 'candidateExperienceId', example: 1 })
  @ResponseMessage('Experience deleted successfully')
  @ApiResponse({ status: 200, description: 'Experience record deleted.' })
  async remove(
    @Param('candidateExperienceId') candidateExperienceId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.candidateExperiencesService.remove(
      candidateExperienceId,
      currentUser.id,
    );
  }
}
