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

@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(Benefit)
    private benefitRepository: Repository<Benefit>,
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
    return this.benefitRepository.save(benefit);
  }

  findAll() {
    return this.benefitRepository.find();
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
    return this.benefitRepository.save(benefit);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.benefitRepository.delete(id);
  }

  async checkAllBenefitIds(ids: number[]) {
    return await this.benefitRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
