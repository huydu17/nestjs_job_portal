import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.create(createJobDto, currentUser.id);
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.jobService.findAll(query);
  }

  @Get('recruiter')
  async findAllForRecruiter(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.findAllForRecruiter(query, currentUser.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.jobService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.jobService.update(id, updateJobDto, currentUser.id);
  }

  @Patch(':id/status')
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
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.jobService.remove(id, currentUser.id);
  }
}
