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

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industry)
    private industryRepository: Repository<Industry>,
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
    return this.industryRepository.save(industry);
  }

  findAll() {
    return this.industryRepository.find();
  }

  async findOne(id: number) {
    const industry = await this.industryRepository.findOne({
      where: { id },
    });
    if (!industry) {
      throw new NotFoundException('Industry not found');
    }
    return industry;
  }

  async update(id: number, updateIndustryDto: UpdateIndustryDto) {
    const industry = await this.findOne(id);
    Object.assign(industry, updateIndustryDto);
    return this.industryRepository.save(industry);
  }

  async remove(id: number) {
    await this.findOne(id);
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
