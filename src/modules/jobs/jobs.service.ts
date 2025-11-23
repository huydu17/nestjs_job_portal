/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { Job } from './entities/job.entity';
import { JobStatus } from 'src/common/enums/job-status.enum';
import { CompaniesService } from '../companies/companies.service';
import { RecruiterPackagesService } from '../recruiter-packages/recruiter-packages.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { BenefitsService } from '../benefits/benefits.service';
import { SkillsService } from '../skills/skills.service';
import { JobSkill } from './entities/job-skill.entity';
import { JobBenefit } from './entities/job-benefit.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private companyService: CompaniesService,
    private recruiterPackageService: RecruiterPackagesService,
    private paginationService: PaginationService,
    private benefitService: BenefitsService,
    private skillService: SkillsService,
    private redisService: RedisService,
  ) {}

  async create(createJobDto: CreateJobDto, userId: number): Promise<Job> {
    const { skillIds, benefitIds } = createJobDto;
    const uniqueSkills = [...new Set(skillIds)];
    const uniqueBenefits = [...new Set(benefitIds)];
    await this.checkAllIdExist(uniqueSkills, uniqueBenefits);
    const company = await this.companyService.findOneByUserId(userId);
    const recruiterPackages =
      await this.recruiterPackageService.findActivePackage(userId);
    if (!recruiterPackages) {
      throw new BadRequestException('You must buy a package');
    }
    if (recruiterPackages.remainingPost <= 0) {
      throw new BadRequestException(
        'You have reached the limit of your current package',
      );
    }
    const job = await this.jobRepository.save({
      ...createJobDto,
      companyId: company.id,
      postById: userId,
      jobSkills: uniqueSkills.map((s) => ({ skillId: s })),
      jobBenefits: uniqueBenefits.map((b) => ({ benefitId: b })),
    });
    await this.recruiterPackageService.decreaseRemainingPost(
      recruiterPackages.id,
    );
    return this.findOne(job.id);
  }

  async findAll(query: PaginationQueryDto) {
    const { filter } = query;
    const condition: any = {
      order: { createdAt: 'DESC' },
      relations: this.getJobRelations(),
      where: {},
    };
    if (filter) {
      condition.where.title = Like(`%${filter}%`);
    }
    const jobs = await this.paginationService.paginateQuery(
      query,
      this.jobRepository,
      condition,
    );
    return jobs;
  }

  async findAllForRecruiter(query: PaginationQueryDto, userId: number) {
    const { filter } = query;
    const condition: any = {
      where: { postById: userId },
      order: { createdAt: 'DESC' },
      relations: this.getJobRelations(),
    };
    if (filter) {
      condition.where.title = Like(`%${filter}%`);
    }
    const jobs = await this.paginationService.paginateQuery(
      query,
      this.jobRepository,
      condition,
    );
    return jobs;
  }

  async findOne(id: number): Promise<Job> {
    const key = this.getCacheKey(id);
    const cachedJob = await this.redisService.get(key);
    if (cachedJob) {
      return JSON.parse(cachedJob);
    }
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: this.getJobRelations(),
    });

    if (!job) {
      throw new NotFoundException(`Cannot find job: ${id}`);
    }
    await this.redisService.set(key, JSON.stringify(job), 3600);
    return job;
  }

  async update(
    id: number,
    updateJobDto: UpdateJobDto,
    userId: number,
  ): Promise<Job> {
    const { skillIds, benefitIds } = updateJobDto;
    const uniqueSkills = [...new Set(skillIds)];
    const uniqueBenefits = [...new Set(benefitIds)];
    await this.checkAllIdExist(uniqueSkills, uniqueBenefits);
    const job = await this.findOne(id);
    await this.companyService.findOneEnsureOwner(job.companyId, userId);

    await this.jobRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Job, id, updateJobDto);
        if (uniqueSkills.length > 0) {
          await transactionalEntityManager.delete(JobSkill, { jobId: id });
          const newJobSkills = uniqueSkills.map((skillId) =>
            transactionalEntityManager.create(JobSkill, {
              jobId: id,
              skillId: skillId,
            }),
          );
          await transactionalEntityManager.save(newJobSkills);
        }
        if (uniqueBenefits.length > 0) {
          await transactionalEntityManager.delete(JobBenefit, { jobId: id });
          const newJobBenefits = uniqueBenefits.map((benefitId) =>
            transactionalEntityManager.create(JobBenefit, {
              jobId: id,
              benefitId,
            }),
          );
          await transactionalEntityManager.save(newJobBenefits);
        }
      },
    );
    await this.redisService.del(this.getCacheKey(id));
    return this.findOne(id);
  }

  async updateStatus(
    id: number,
    updateJobStatusDto: UpdateJobStatusDto,
    userId: number,
  ): Promise<Job> {
    const job = await this.findOne(id);
    await this.companyService.findOneEnsureOwner(job.companyId, userId);
    job.status = updateJobStatusDto.status;
    await this.redisService.del(this.getCacheKey(id));
    return await this.jobRepository.save(job);
  }

  async remove(id: number, userId: number): Promise<void> {
    const job = await this.findOne(id);
    await this.companyService.findOneEnsureOwner(job.companyId, userId);
    await this.redisService.del(this.getCacheKey(id));
    await this.jobRepository.softDelete(id);
  }

  async findOneActive(jobId: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
        status: JobStatus.ACTIVE,
      },
    });
    if (!job) {
      throw new NotFoundException('This job is no longer active');
    }
    return job;
  }

  async findJobByUser(id: number, userId: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id, postById: userId },
    });
    if (!job) {
      throw new NotFoundException(
        'Cannot find job or you do not have permission to access this job',
      );
    }
    return job;
  }

  async checkAllIdExist(skillIds: number[], benefitIds: number[]) {
    const skillEntities =
      skillIds.length > 0
        ? await this.skillService.checkAllSkillIds(skillIds)
        : [];
    if (skillEntities.length !== skillIds.length) {
      throw new BadRequestException('One or more skill dont exist');
    }
    const benefitEntities =
      benefitIds.length > 0
        ? await this.benefitService.checkAllBenefitIds(benefitIds)
        : [];
    if (benefitEntities.length !== benefitIds.length) {
      throw new BadRequestException('One or more benefit dont exist');
    }
  }

  async increaseTotalApplications(id: number) {
    await this.jobRepository.increment({ id }, 'totalApplications', 1);
    await this.redisService.del(this.getCacheKey(id));
  }

  private getCacheKey(id: number): string {
    return `job:${id}`;
  }

  private getJobRelations() {
    return [
      'company',
      'company.companyImages',
      'postBy',
      'jobSkills',
      'jobSkills.skill',
      'jobBenefits',
      'jobBenefits.benefit',
    ];
  }
}
