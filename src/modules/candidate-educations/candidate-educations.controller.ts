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
import { CreateCandidateEducationDto } from './dto/create-candidate-education.dto';
import { UpdateCandidateEducationDto } from './dto/update-candidate-education.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CandidateEducationsService } from './candidate-educations.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseCandidateEducationDto } from './dto/response-candidate-education.dto';

@Controller('candidate-educations')
@UseGuards(JwtAuthGuard)
export class CandidateEducationsController {
  constructor(
    private readonly candidateEducationsService: CandidateEducationsService,
  ) {}

  @Post()
  @Serialize(ResponseCandidateEducationDto)
  async create(
    @Body() createCandidateEducationDto: CreateCandidateEducationDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateEducationsService.create(
      createCandidateEducationDto,
      currentUser.id,
    );
  }

  @Get('me')
  async findMyEducations(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateEducationsService.findMyEducations(
      currentUser.id,
    );
  }

  @Patch(':educationId')
  @Serialize(ResponseCandidateEducationDto)
  async update(
    @Param('educationId') educationId: number,
    @Body() updateCandidateEducationDto: UpdateCandidateEducationDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateEducationsService.update(
      educationId,
      updateCandidateEducationDto,
      currentUser.id,
    );
  }

  @Delete(':educationId')
  async remove(
    @Param('educationId') educationId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.candidateEducationsService.remove(educationId, currentUser.id);
  }
}
