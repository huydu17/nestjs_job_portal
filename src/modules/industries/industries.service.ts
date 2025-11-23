/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Industry } from './entities/industry.entity';
import { In, Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class IndustriesService {
  private readonly CACHE_KEY = 'industries';
  constructor(
    @InjectRepository(Industry)
    private industryRepository: Repository<Industry>,
    private redisService: RedisService,
  ) {}
  async create(createIndustryDto: CreateIndustryDto) {
    const { name } = createIndustryDto;
    const industryExist = await this.industryRepository.findOne({
      where: { name },
    });
    if (industryExist) {
      throw new BadRequestException('Industry already exists');
    }
    const industry = new Industry();
    Object.assign(industry, createIndustryDto);
    await this.redisService.del(this.CACHE_KEY);
    return this.industryRepository.save(industry);
  }

  async findAll() {
    const cachedData = await this.redisService.get(this.CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData as string);
    }
    const industries = await this.industryRepository.find();
    await this.redisService.set(
      this.CACHE_KEY,
      JSON.stringify(industries),
      86400,
    );
    return industries;
  }

  async findOne(id: number) {
    const industry = await this.industryRepository.findOne({
      where: { id },
    });
    if (!industry) {
      throw new NotFoundException('Industry not found');
    }
    await this.redisService.del(this.CACHE_KEY);
    return industry;
  }

  async update(id: number, updateIndustryDto: UpdateIndustryDto) {
    const industry = await this.findOne(id);
    Object.assign(industry, updateIndustryDto);
    await this.redisService.del(this.CACHE_KEY);
    return this.industryRepository.save(industry);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.redisService.del(this.CACHE_KEY);
    await this.industryRepository.delete(id);
  }

  async checkAllIndustryIds(ids: number[]) {
    return await this.industryRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
