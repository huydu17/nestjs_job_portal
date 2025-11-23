import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyIndustry } from '../entities/company-industry.entity';
import { CompaniesService } from '../companies.service';
import { IndustriesService } from 'src/modules/industries/industries.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CompanyIndustriesService {
  constructor(
    @InjectRepository(CompanyIndustry)
    private companyIndustryRepository: Repository<CompanyIndustry>,
    @Inject(forwardRef(() => CompaniesService))
    private companyService: CompaniesService,
    private industryService: IndustriesService,
    private redisService: RedisService,
  ) {}
  async syncIndustries(userId: number, industryIds: number[]) {
    const uniqueIndusties = [...new Set(industryIds)];
    if (uniqueIndusties.length > 0) {
      const foundIndustries =
        await this.industryService.checkAllIndustryIds(uniqueIndusties);
      if (foundIndustries.length !== uniqueIndusties.length) {
        throw new BadRequestException('One or more industries dont exist');
      }
    }
    const company = await this.companyService.findOneByUserId(userId);
    const currentAssignments = await this.companyIndustryRepository.find({
      where: { companyId: company.id },
    });
    const currentIds = currentAssignments.map((a) => a.industryId);
    const industriesToAdd = uniqueIndusties.filter(
      (id) => !currentIds.includes(id),
    );
    const assignmentsToRemove = currentAssignments.filter(
      (a) => !uniqueIndusties.includes(a.industryId),
    );
    await this.companyIndustryRepository.manager.transaction(
      async (transactionalEntityManager) => {
        if (assignmentsToRemove.length > 0) {
          await transactionalEntityManager.remove(assignmentsToRemove);
        }
        if (industriesToAdd.length > 0) {
          const newAssignments = industriesToAdd.map((industryId) =>
            this.companyIndustryRepository.create({
              companyId: company.id,
              industryId,
            }),
          );
          await transactionalEntityManager.save(newAssignments);
        }
      },
    );
    await this.redisService.del(`company:${company.id}`);
  }
}
