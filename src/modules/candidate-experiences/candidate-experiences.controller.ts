/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateCandidateExperienceDto } from './dto/create-candidate-experience.dto';
import { UpdateCandidateExperienceDto } from './dto/update-candidate-experience.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CandidateExperiencesService } from './candidate-experiences.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('candidate-experiences')
@UseGuards(JwtAuthGuard)
export class CandidateExperiencesController {
  constructor(
    private readonly candidateExperiencesService: CandidateExperiencesService,
  ) {}

  @Post()
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
  async findMyExperiences(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateExperiencesService.findMyExperiences(
      currentUser.id,
    );
  }

  @Patch(':candidateExperienceId')
  async update(
    @Param('candidateExperienceId') candidateExperienceId: number,
    @Body() updateCandidateExperienceDto: UpdateCandidateExperienceDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    console.log(updateCandidateExperienceDto);
    return await this.candidateExperiencesService.update(
      candidateExperienceId,
      updateCandidateExperienceDto,
      currentUser.id,
    );
  }

  @Delete(':candidateExperienceId')
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
