import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApplicationDetailResponseDto,
  CandidateApplicationResponseDto,
  RecruiterApplicationResponseDto,
} from './entities/application-response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applies')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Submit a job application (Candidate only)' })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (Already applied or Job not found/expired).',
  })
  @Serialize(CandidateApplicationResponseDto)
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.applicationsService.create(
      createApplicationDto,
      currentUser,
    );
  }

  @Get('candidate')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateApplicationResponseDto)
  @ApiOperation({ summary: 'Get my application history (Candidate only)' })
  @ApiResponse({
    status: 200,
    description: 'List of applications submitted by the current user.',
  })
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
  @Roles(Role.RECRUITER)
  @Serialize(RecruiterApplicationResponseDto)
  @ApiOperation({ summary: 'Get applications for my jobs (Recruiter only)' })
  @ApiResponse({
    status: 200,
    description: 'List of applicants for jobs posted by my company.',
  })
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
  @Roles(Role.CANDIDATE, Role.RECRUITER)
  @Serialize(ApplicationDetailResponseDto)
  @ApiOperation({ summary: 'Get application details by composite ID' })
  @ApiParam({
    name: 'candidateProfileId',
    description: 'ID of the Candidate Profile',
    example: 10,
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID of the Job',
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'Application details returned.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async findOne(
    @Param('candidateProfileId', ParseIntPipe) candidateProfileId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.applicationsService.findOne(
      candidateProfileId,
      jobId,
      currentUser,
    );
  }

  @Patch(':candidateProfileId/:jobId/status')
  @Roles(Role.RECRUITER)
  @Serialize(RecruiterApplicationResponseDto)
  @ApiOperation({ summary: 'Update application status (Recruiter only)' })
  @ApiParam({ name: 'candidateProfileId', example: 10 })
  @ApiParam({ name: 'jobId', example: 50 })
  @ApiBody({
    type: UpdateApplicationStatusDto,
    description: 'New status (e.g., INTERVIEW, REJECTED, ACCEPTED)',
  })
  @ApiResponse({ status: 200, description: 'Status updated successfully.' })
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
