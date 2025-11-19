import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateExperienceDto } from './dto/create-candidate-experience.dto';
import { UpdateCandidateExperienceDto } from './dto/update-candidate-experience.dto';
import { CandidateExperience } from './entities/candidate-experience.entity';
import { CandidateProfilesService } from '../candidate-profiles/candidate-profiles.service';

@Injectable()
export class CandidateExperiencesService {
  constructor(
    @InjectRepository(CandidateExperience)
    private candidateExperienceRepository: Repository<CandidateExperience>,
    private candidateProfileService: CandidateProfilesService,
  ) {}

  async create(
    createCandidateExperienceDto: CreateCandidateExperienceDto,
    userId: number,
  ): Promise<any> {
    const { company, department, startDate, endDate, responsibilities } =
      createCandidateExperienceDto;
    if (endDate && startDate > endDate) {
      throw new BadRequestException('Start date cannot be later than end date');
    }
    const candidateProfile =
      await this.candidateProfileService.findOneByUserId(userId);
    const candidateExperience = this.candidateExperienceRepository.create({
      company,
      department,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      responsibilities,
      candidateProfileId: candidateProfile.id,
    });
    return await this.candidateExperienceRepository.save(candidateExperience);
  }

  async findMyExperiences(userId: number): Promise<CandidateExperience[]> {
    const candidateProfile =
      await this.candidateProfileService.findOneByUserId(userId);
    return await this.candidateExperienceRepository.find({
      where: { candidateProfileId: candidateProfile.id },
    });
  }

  async findOne(candidateExperienceId: number): Promise<CandidateExperience> {
    const candidateExperience =
      await this.candidateExperienceRepository.findOne({
        where: { id: candidateExperienceId },
        relations: ['candidateProfile'],
      });
    if (!candidateExperience) {
      throw new NotFoundException(
        `Not found candidate experience with ID: ${candidateExperienceId}`,
      );
    }
    return candidateExperience;
  }

  async update(
    candidateExperienceId: number,
    updateCandidateExperienceDto: UpdateCandidateExperienceDto,
    userId: number,
  ): Promise<CandidateExperience> {
    const { startDate, endDate } = updateCandidateExperienceDto;
    const candidateExperience = await this.findOneEnsureOwner(
      candidateExperienceId,
      userId,
    );
    const newStart = startDate || candidateExperience.startDate;
    const newEnd = endDate || candidateExperience.endDate;
    if (newEnd && newStart > newEnd) {
      throw new BadRequestException('Start year cannot be later than end year');
    }
    if (startDate !== undefined)
      candidateExperience.startDate = new Date(startDate);
    if (endDate !== undefined)
      candidateExperience.endDate = endDate ? new Date(endDate) : null;
    Object.assign(candidateExperience, updateCandidateExperienceDto);
    return await this.candidateExperienceRepository.save(candidateExperience);
  }

  async remove(candidateExperienceId: number, userId: number): Promise<void> {
    await this.findOneEnsureOwner(candidateExperienceId, userId);
    await this.candidateExperienceRepository.delete(candidateExperienceId);
  }

  private async findOneEnsureOwner(
    candidateExperienceId: number,
    userId: number,
  ) {
    const candidateSkills = await this.findOne(candidateExperienceId);
    if (candidateSkills.candidateProfile.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this record',
      );
    }
    return candidateSkills;
  }
}
