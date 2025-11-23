/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Benefit } from './entities/benefit.entity';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class BenefitsService {
  private readonly CACHE_KEY = 'benefits';
  constructor(
    @InjectRepository(Benefit)
    private benefitRepository: Repository<Benefit>,
    private redisService: RedisService,
  ) {}
  async create(createBenefitDto: CreateBenefitDto) {
    const { name } = createBenefitDto;
    const benefitExist = await this.benefitRepository.findOne({
      where: { name },
    });
    if (benefitExist) {
      throw new BadRequestException('Benefit already exists');
    }
    const benefit = new Benefit();
    Object.assign(benefit, createBenefitDto);
    await this.redisService.del(this.CACHE_KEY);
    return this.benefitRepository.save(benefit);
  }

  async findAll() {
    const cachedData = await this.redisService.get(this.CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const benefits = this.benefitRepository.find();
    await this.redisService.set(
      this.CACHE_KEY,
      JSON.stringify(benefits),
      86400,
    );
    return benefits;
  }

  async findOne(id: number) {
    const benefit = await this.benefitRepository.findOne({
      where: { id },
    });
    if (!benefit) {
      throw new NotFoundException('Benefit not found');
    }
    return benefit;
  }

  async update(id: number, updateBenefitDto: UpdateBenefitDto) {
    const benefit = await this.findOne(id);
    Object.assign(benefit, updateBenefitDto);
    await this.redisService.del(this.CACHE_KEY);
    return this.benefitRepository.save(benefit);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.benefitRepository.delete(id);
    await this.redisService.del(this.CACHE_KEY);
  }

  async checkAllBenefitIds(ids: number[]) {
    return await this.benefitRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
