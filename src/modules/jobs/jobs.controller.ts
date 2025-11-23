import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JobsService } from './jobs.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
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
import { JobResponseDto } from './dto/job-response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @Serialize(JobResponseDto)
  @ApiOperation({ summary: 'Create a new job posting' })
  @ResponseMessage('Job created successfully')
  @ApiResponse({ status: 201, description: 'Job created.' })
  @ApiResponse({ status: 400, description: 'Limit reached or Invalid data.' })
  async create(
    @Body() createJobDto: CreateJobDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.create(createJobDto, currentUser.id);
  }

  @Get()
  @Public()
  @Serialize(JobResponseDto)
  @ApiOperation({ summary: 'Search and Filter jobs (Public)' })
  @ApiResponse({ status: 200, description: 'List of jobs.' })
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.jobService.findAll(query);
  }

  @Get('recruiter')
  @ApiBearerAuth()
  @Serialize(JobResponseDto)
  @Roles(Role.RECRUITER)
  @ApiOperation({ summary: 'Get jobs posted by me (Recruiter)' })
  @ApiResponse({ status: 200, description: 'List of my jobs.' })
  async findAllForRecruiter(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.findAllForRecruiter(query, currentUser.id);
  }

  @Get(':id')
  @Public()
  @Serialize(JobResponseDto)
  @ApiOperation({ summary: 'Get job details' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Job details.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.jobService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @Serialize(JobResponseDto)
  @ApiOperation({ summary: 'Update job information' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Job updated successfully')
  @ApiResponse({ status: 200, description: 'Job updated.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.update(id, updateJobDto, currentUser.id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @Serialize(JobResponseDto)
  @ApiOperation({ summary: 'Update job status (Open/Close/Fill)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Job status updated successfully')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.updateStatus(
      id,
      updateJobStatusDto,
      currentUser.id,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.RECRUITER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Job deleted successfully')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.jobService.remove(id, currentUser.id);
  }
}
