/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
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

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private paginationService: PaginationService,
    private companyIndustryService: CompanyIndustriesService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, currentUser: AuthUser) {
    const { industryIds, establishmentDate } = createCompanyDto;
    const uniqueIndustryIds = [...new Set(industryIds)];
    const industryEntities =
      uniqueIndustryIds && uniqueIndustryIds.length > 0
        ? industryIds.map((id) => ({ industryId: id }))
        : [];
    const company = await this.companyRepository.create({
      ...createCompanyDto,
      establishmentDate: new Date(establishmentDate),
      userId: currentUser.id,
      companyIndustries: industryEntities,
    });
    return await this.companyRepository.save(company);
  }

  async findAll(queryDto: PaginationQueryDto) {
    const { filter } = queryDto;
    const whereCondition: any = {
      where: { isApproved: true },
      relations: ['user', 'companyImages', 'companyIndustries'],
    };
    if (filter) {
      whereCondition.where.name = Like(`%${filter}%`);
    }
    const companies = await this.paginationService.paginateQuery(
      queryDto,
      this.companyRepository,
      whereCondition,
    );
    return companies;
  }

  async findAllForAdmin(queryDto: PaginationQueryDto) {
    const { filter } = queryDto;
    const whereCondition: any = {
      relations: ['user', 'companyImages', 'companyIndustries'],
    };
    if (filter) {
      whereCondition.where.name = Like(`%${filter}%`);
    }
    const companies = await this.paginationService.paginateQuery(
      queryDto,
      this.companyRepository,
      whereCondition,
    );
    return companies;
  }

  async findMyCompanies(queryDto: PaginationQueryDto, userId: number) {
    const { filter } = queryDto;
    const whereCondition: any = {
      where: { userId },
      relations: ['user', 'companyImages', 'companyIndustries'],
    };
    if (filter) {
      whereCondition.where.name = Like(`%${filter}%`);
    }
    const companies = await this.paginationService.paginateQuery(
      queryDto,
      this.companyRepository,
      whereCondition,
    );
    return companies;
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id, isApproved: true },
      relations: ['user', 'companyImages', 'companyIndustries'],
    });

    if (!company) {
      throw new NotFoundException('Cannot find company');
    }
    return company;
  }

  async findOneAdmin(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user', 'companyImages', 'companyIndustries'],
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
    return await this.companyRepository.save(company);
  }

  async approved(
    id: number,
    approveCompanyDto: ApproveCompanyDto,
  ): Promise<Company> {
    await this.findOneAdmin(id);
    const company = await this.companyRepository.save({
      id,
      isApproved: approveCompanyDto.isApproved,
    });
    return company;
  }

  async remove(id: number, currentUser: AuthUser): Promise<void> {
    const company = await this.findOneAdmin(id);
    const isAdmin = currentUser.roles.includes(Role.ADMIN);
    const isOwner = company.userId === currentUser.id;
    if (isAdmin || isOwner) {
      await this.companyRepository.delete(id);
      return;
    }
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
}
