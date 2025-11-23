/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SkillsService {
  private readonly CACHE_KEY = 'skills';
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    private redisService: RedisService,
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    const { name } = createSkillDto;
    const skillExist = await this.skillRepository.findOne({
      where: { name },
    });
    if (skillExist) {
      throw new BadRequestException('Skill already exists');
    }
    const skill = new Skill();
    Object.assign(skill, createSkillDto);
    await this.redisService.del(this.CACHE_KEY);
    return this.skillRepository.save(skill);
  }

  async findAll() {
    const cachedData = await this.redisService.get(this.CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData as string);
    }
    const skills = await this.skillRepository.find();
    await this.redisService.set(this.CACHE_KEY, JSON.stringify(skills), 86400);
    return skills;
  }

  async findOne(skillId: number) {
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async update(skillId: number, updateSkilleDto: UpdateSkillDto) {
    const skill = await this.findOne(skillId);
    Object.assign(skill, updateSkilleDto);
    await this.redisService.del(this.CACHE_KEY);
    return this.skillRepository.save(skill);
  }

  async remove(skillId: number) {
    await this.findOne(skillId);
    await this.redisService.del(this.CACHE_KEY);
    await this.skillRepository.delete(skillId);
  }

  async findOneByName(name: string) {
    const skill = await this.skillRepository.findOne({
      where: { name },
    });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }
  async checkAllSkillIds(skills: number[]) {
    return await this.skillRepository.find({
      where: {
        id: In(skills),
      },
    });
  }
}
