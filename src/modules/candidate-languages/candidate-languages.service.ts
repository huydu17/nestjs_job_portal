import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateLanguageDto } from './dto/create-candidate-language.dto';
import { UpdateCandidateLanguageDto } from './dto/update-candidate-language.dto';
import { CandidateLanguage } from './entities/candidate-language.entity';
import { CandidateProfilesService } from '../candidate-profiles/candidate-profiles.service';
import { LanguagesService } from '../languages/languages.service';

@Injectable()
export class CandidateLanguagesService {
  constructor(
    @InjectRepository(CandidateLanguage)
    private candidateLanguageRepository: Repository<CandidateLanguage>,
    private candidateProfileService: CandidateProfilesService,
    private languageService: LanguagesService,
  ) {}

  async create(
    createCandidateLanguageDto: CreateCandidateLanguageDto,
    userId: number,
  ): Promise<CandidateLanguage> {
    const { languageId, level } = createCandidateLanguageDto;
    const candidate =
      await this.candidateProfileService.findOneByUserId(userId);
    const language = await this.languageService.findOne(languageId);
    const existingLanguage = await this.candidateLanguageRepository.findOne({
      where: {
        candidateProfileId: candidate.id,
        languageId: language.id,
      },
    });
    if (existingLanguage) {
      throw new BadRequestException('Candidate already has this language');
    }
    const candidateLanguage = this.candidateLanguageRepository.create({
      candidateProfileId: candidate.id,
      languageId: language.id,
      level,
    });
    return await this.candidateLanguageRepository.save(candidateLanguage);
  }

  async findOne(candidateLanguageId: number) {
    const candidateLanguage = await this.candidateLanguageRepository.findOne({
      where: { id: candidateLanguageId },
      relations: ['candidateProfile'],
    });
    if (!candidateLanguage) {
      throw new NotFoundException('Candidate language not found');
    }
    return candidateLanguage;
  }

  async findMyLanguages(userId: number): Promise<CandidateLanguage[]> {
    const candidateProfile =
      await this.candidateProfileService.findOneByUserId(userId);
    return await this.candidateLanguageRepository.find({
      where: { candidateProfileId: candidateProfile.id },
      relations: ['language'],
    });
  }

  async updateLevel(
    candidateLanguageId: number,
    updateCandidateLanguageDto: UpdateCandidateLanguageDto,
    userId: number,
  ): Promise<CandidateLanguage> {
    const { level } = updateCandidateLanguageDto;
    const candidateLanguage = await this.findOneEnsureOwner(
      candidateLanguageId,
      userId,
    );
    candidateLanguage.level = level;
    return await this.candidateLanguageRepository.save(candidateLanguage);
  }

  async remove(candidateLanguageId: number, userId: number): Promise<void> {
    await this.findOneEnsureOwner(candidateLanguageId, userId);
    await this.candidateLanguageRepository.delete(candidateLanguageId);
  }

  private async findOneEnsureOwner(id: number, userId: number) {
    const candidateLanguage = await this.findOne(id);
    if (candidateLanguage?.candidateProfile?.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this record',
      );
    }
    return candidateLanguage;
  }
}
