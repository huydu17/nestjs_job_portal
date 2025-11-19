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

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
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
    return this.skillRepository.save(skill);
  }

  findAll() {
    return this.skillRepository.find();
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
    return this.skillRepository.save(skill);
  }

  async remove(skillId: number) {
    await this.findOne(skillId);
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
