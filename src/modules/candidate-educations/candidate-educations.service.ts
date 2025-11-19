import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateEducationDto } from './dto/create-candidate-education.dto';
import { UpdateCandidateEducationDto } from './dto/update-candidate-education.dto';
import { CandidateEducation } from './entities/candidate-education.entity';
import { CandidateProfilesService } from '../candidate-profiles/candidate-profiles.service';

@Injectable()
export class CandidateEducationsService {
  constructor(
    @InjectRepository(CandidateEducation)
    private candidateEducationRepository: Repository<CandidateEducation>,
    private candidateProfileService: CandidateProfilesService,
  ) {}

  async create(
    createCandidateEducationDto: CreateCandidateEducationDto,
    userId: number,
  ): Promise<CandidateEducation> {
    const { yearStart, yearEnd } = createCandidateEducationDto;
    if (yearStart > yearEnd) {
      throw new BadRequestException('Start year cannot be later than end year');
    }
    const candidate =
      await this.candidateProfileService.findOneByUserId(userId);
    const candidateEducation = this.candidateEducationRepository.create({
      ...createCandidateEducationDto,
      candidateProfileId: candidate.id,
    });
    return this.candidateEducationRepository.save(candidateEducation);
  }

  async findMyEducations(userId: number): Promise<CandidateEducation[]> {
    return await this.candidateEducationRepository.find({
      where: {
        candidateProfile: {
          user: { id: userId },
        },
      },
    });
  }

  async update(
    educationId: number,
    updateCandidateEducationDto: UpdateCandidateEducationDto,
    userId: number,
  ): Promise<CandidateEducation> {
    const { yearStart, yearEnd } = updateCandidateEducationDto;
    const education = await this.findOneEnsureOwner(educationId, userId);
    const newStart = yearStart || education.yearStart;
    const newEnd = yearEnd || education.yearEnd;
    if (newStart > newEnd) {
      throw new BadRequestException('Start year cannot be later than end year');
    }
    Object.assign(education, updateCandidateEducationDto);
    return await this.candidateEducationRepository.save(education);
  }

  async remove(educationId: number, userId: number): Promise<void> {
    const education = await this.findOneEnsureOwner(educationId, userId);
    await this.candidateEducationRepository.remove(education);
  }

  private async findOneEnsureOwner(id: number, userId: number) {
    const education = await this.candidateEducationRepository.findOne({
      where: { id },
      relations: ['candidateProfile'],
    });
    if (!education) {
      throw new NotFoundException('Education not found');
    }
    if (education.candidateProfile.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this record',
      );
    }
    return education;
  }
}
