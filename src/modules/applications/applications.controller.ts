import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('applies')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.applicationsService.create(
      createApplicationDto,
      currentUser.id,
    );
  }

  @Get('candidate')
  async findAllForCandidate(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.applicationsService.findAllForCandidate(
      query,
      currentUser.id,
    );
  }

  @Get('recruiter')
  async findAllForRecruiter(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.applicationsService.findAllForRecruiter(
      query,
      currentUser.id,
    );
  }

  @Get(':candidateProfileId/:jobId')
  async findOne(
    @Param('candidateProfileId', ParseIntPipe) candidateProfileId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
  ) {
    return await this.applicationsService.findOne(candidateProfileId, jobId);
  }

  @Patch(':candidateProfileId/:jobId/status')
  async updateStatus(
    @Param('candidateProfileId', ParseIntPipe) candidateProfileId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.applicationsService.updateStatus(
      candidateProfileId,
      jobId,
      updateApplicationStatusDto,
      currentUser.id,
    );
  }
}
