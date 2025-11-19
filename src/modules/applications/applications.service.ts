/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JobsService } from '../jobs/jobs.service';
import { CandidateProfilesService } from '../candidate-profiles/candidate-profiles.service';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applyRepository: Repository<Application>,
    private jobService: JobsService,
    private candidateProfileSerice: CandidateProfilesService,
    private paginationService: PaginationService,
    private companyService: CompaniesService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    userId: number,
  ): Promise<Application> {
    const { jobId } = createApplicationDto;
    await this.jobService.findOneActive(jobId);
    const candidate = await this.candidateProfileSerice.findOneByUserId(userId);
    const existingApply = await this.applyRepository.findOne({
      where: {
        candidateProfileId: candidate.id,
        jobId,
      },
    });
    if (existingApply) {
      throw new BadRequestException('You have already applied for this job');
    }
    const apply = await this.applyRepository.save({
      candidateProfileId: candidate.id,
      jobId,
    });
    await this.jobService.increaseTotalApplications(jobId);
    return apply;
  }

  async findAllForCandidate(query: PaginationQueryDto, userId: number) {
    const { filter } = query;

    const candidate = await this.candidateProfileSerice.findOneByUserId(userId);

    const condition: any = {
      where: { candidateProfileId: candidate.id },
      relations: ['job', 'job.company'],
    };
    if (filter) {
      condition.where.job = { title: Like(`%${filter}%`) };
    }
    const applications = await this.paginationService.paginateQuery(
      query,
      this.applyRepository,
      condition,
    );
    return applications;
  }

  async findAllForRecruiter(query: PaginationQueryDto, userId: number) {
    const { filter } = query;
    const company = await this.companyService.findOneByUserId(userId);
    const condition: any = {
      where: {
        job: { companyId: company.id },
      },
      relations: ['job', 'candidateProfile'],
      order: { applyDate: 'DESC' },
    };
    if (filter) {
      condition.where.candidateProfile = { fullName: Like(`%${filter}%`) };
    }
    const applications = await this.paginationService.paginateQuery(
      query,
      this.applyRepository,
      condition,
    );
    return applications;
  }

  async findOne(
    candidateProfileId: number,
    jobId: number,
  ): Promise<Application> {
    const apply = await this.applyRepository.findOne({
      where: { candidateProfileId, jobId },
      relations: ['job', 'job.company', 'candidateProfile'],
    });
    if (!apply) {
      throw new NotFoundException('Application not found');
    }
    return apply;
  }

  async updateStatus(
    candidateProfileId: number,
    jobId: number,
    updateApplyStatusDto: UpdateApplicationStatusDto,
    userId: number,
  ): Promise<Application> {
    await this.jobService.findJobByUser(jobId, userId);
    const apply = await this.applyRepository.findOne({
      where: { candidateProfileId, jobId },
    });
    if (!apply) {
      throw new NotFoundException('Application not found');
    }
    await this.companyService.findOneEnsureOwner(apply.job.companyId, userId);
    const updatedApply = await this.applyRepository.save({
      candidateProfileId,
      jobId,
      status: updateApplyStatusDto.status,
    });
    return updatedApply;
  }
}
