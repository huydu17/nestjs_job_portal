/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApproveCompanyDto } from './dto/approve-company.dto';
import { Company } from './entities/company.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Role } from '@roles/enums/role.enum';
import { CompanyIndustriesService } from './providers/company-industries.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CompaniesService {
  COMPANY_CACHE_TTL = 3600;
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private paginationService: PaginationService,
    @Inject(forwardRef(() => CompanyIndustriesService))
    private companyIndustryService: CompanyIndustriesService,
    private redisService: RedisService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, currentUser: AuthUser) {
    const { industryIds, establishmentDate } = createCompanyDto;
    const uniqueIndustryIds = [...new Set(industryIds)];
    const industryEntities =
      uniqueIndustryIds && uniqueIndustryIds.length > 0
        ? uniqueIndustryIds.map((id) => ({ industryId: id }))
        : [];
    const company = await this.companyRepository.create({
      ...createCompanyDto,
      establishmentDate: new Date(establishmentDate),
      userId: currentUser.id,
      companyIndustries: industryEntities,
    });
    await this.companyRepository.save(company);
  }

  async findAll(queryDto: PaginationQueryDto) {
    const { filter } = queryDto;
    const condition: any = {
      where: { isApproved: true },
      relations: this.getCompanyRelations(),
    };
    if (filter) {
      condition.where.name = Like(`%${filter}%`);
    }
    const companies = await this.paginationService.paginateQuery(
      queryDto,
      this.companyRepository,
      condition,
    );
    return companies;
  }

  async findAllForAdmin(queryDto: PaginationQueryDto) {
    const { filter } = queryDto;
    const condition: any = {
      relations: this.getCompanyRelations(),
      where: {},
    };
    if (filter) {
      condition.where.name = Like(`%${filter}%`);
    }
    const companies = await this.paginationService.paginateQuery(
      queryDto,
      this.companyRepository,
      condition,
    );
    return companies;
  }

  async findMyCompanies(queryDto: PaginationQueryDto, userId: number) {
    const { filter } = queryDto;
    const condition: any = {
      where: { userId },
      relations: this.getCompanyRelations(),
    };
    if (filter) {
      condition.where.name = Like(`%${filter}%`);
    }
    const companies = await this.paginationService.paginateQuery(
      queryDto,
      this.companyRepository,
      condition,
    );
    return companies;
  }

  async findOne(id: number): Promise<Company> {
    const cacheKey = `company:${id}`;
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const company = await this.companyRepository.findOne({
      where: { id, isApproved: true },
      relations: this.getCompanyRelations(),
    });

    if (!company) {
      throw new NotFoundException('Cannot find company');
    }
    await this.redisService.set(
      cacheKey,
      JSON.stringify(company),
      this.COMPANY_CACHE_TTL,
    );
    return company;
  }

  async findOneAdmin(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: this.getCompanyRelations(),
    });
    if (!company) {
      throw new NotFoundException(`Cannot find company with id: ${id}`);
    }
    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    userId: number,
  ): Promise<Company> {
    const company = await this.findOneEnsureOwner(id, userId);
    const updateData: any = { ...updateCompanyDto };
    if (updateCompanyDto.establishmentDate) {
      updateData.establishmentDate = new Date(
        updateCompanyDto.establishmentDate,
      );
    }
    Object.assign(company, updateData);
    if (
      updateCompanyDto.industryIds &&
      updateCompanyDto?.industryIds?.length >= 0
    ) {
      await this.companyIndustryService.syncIndustries(
        userId,
        updateCompanyDto.industryIds,
      );
    }
    await this.redisService.del(`company:${id}`);
    await this.companyRepository.save(company);
    return this.findOneAdmin(id);
  }

  async approved(
    id: number,
    approveCompanyDto: ApproveCompanyDto,
  ): Promise<Company> {
    await this.findOneAdmin(id);
    await this.companyRepository.save({
      id,
      isApproved: approveCompanyDto.isApproved,
    });
    await this.redisService.del(`company:${id}`);
    return this.findOneAdmin(id);
  }

  async remove(id: number, currentUser: AuthUser): Promise<void> {
    const company = await this.findOneAdmin(id);
    const isAdmin = currentUser.roles.includes(Role.ADMIN);
    const isOwner = company.userId === currentUser.id;
    if (isAdmin || isOwner) {
      await this.companyRepository.softDelete(id);
      return;
    }
    await this.redisService.del(`company:${id}`);
    throw new ForbiddenException(
      'You do not have permission to delete this record',
    );
  }

  async findOneEnsureOwner(
    companyId: number,
    userId: number,
  ): Promise<Company> {
    const company = await this.findOneAdmin(companyId);
    if (company.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this record',
      );
    }
    return company;
  }

  async findOneByUserId(userId: number) {
    const company = await this.companyRepository.findOne({
      where: { userId },
      relations: ['user', 'companyImages', 'companyIndustries'],
    });
    if (!company) {
      throw new NotFoundException(
        'Cannot find company or you dont have permission to update this record',
      );
    }
    return company;
  }
  private getCompanyRelations() {
    return [
      'user',
      'companyImages',
      'companyIndustries',
      'companyIndustries.industry',
    ];
  }
}
