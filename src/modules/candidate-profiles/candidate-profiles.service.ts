/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { RedisService } from 'src/redis/redis.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CandidateProfilesService {
  constructor(
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>,
    private redisService: RedisService,
    private paginationService: PaginationService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createCandidateProfileDto: CreateCandidateProfileDto,
    currentUser: AuthUser,
  ): Promise<CandidateProfile> {
    const existingCandidate = await this.candidateProfileRepository.findOne({
      where: { userId: currentUser.id },
      withDeleted: true,
    });
    if (existingCandidate) {
      if (!existingCandidate.deletedAt) {
        throw new BadRequestException('User already has a candidate profile');
      }
      await this.candidateProfileRepository.restore(existingCandidate.id);
      const { fullName, gender, phone, birthdate, address } =
        createCandidateProfileDto;
      Object.assign(existingCandidate, {
        fullName,
        gender,
        phone,
        birthdate: new Date(birthdate),
        address,
        openToWork: false,
        deletedAt: null,
      });

      const savedProfile =
        await this.candidateProfileRepository.save(existingCandidate);
      const profileKey = `candidate-profiles:${savedProfile.id}`;
      await this.redisService.set(
        profileKey,
        JSON.stringify(savedProfile),
        3600,
      );
      return this.findProfileWithDetails(savedProfile.id);
    }
    const { fullName, gender, phone, birthdate, address } =
      createCandidateProfileDto;
    const candidateProfile = await this.candidateProfileRepository.save({
      fullName,
      gender,
      phone,
      birthdate: new Date(birthdate),
      address,
      userId: currentUser.id,
    });
    const profileKey = `candidate-profiles:${candidateProfile.id}`;
    await this.redisService.set(
      profileKey,
      JSON.stringify(candidateProfile),
      3600,
    );
    return this.findProfileWithDetails(candidateProfile.id);
  }

  async findAll(queryDto: PaginationQueryDto) {
    const { filter } = queryDto;
    const condition: any = {
      where: { status: true },
      relations: ['candidateSkills', 'candidateSkills.skill'],
    };
    if (filter) {
      condition.where.fullName = Like(`%${filter}%`);
    }
    const candidates = await this.paginationService.paginateQuery(
      queryDto,
      this.candidateProfileRepository,
      condition,
    );
    return candidates;
  }

  async findOne(id: number): Promise<CandidateProfile> {
    return await this.findProfileWithDetails(id);
  }

  async getMyProfile(userId: number): Promise<CandidateProfile> {
    const candidateProfile = await this.candidateProfileRepository.findOne({
      where: { userId: userId },
    });
    if (!candidateProfile) {
      throw new NotFoundException('Candidate profile not found');
    }
    return this.findProfileWithDetails(candidateProfile.id);
  }

  async update(
    updateCandidateProfileDto: UpdateCandidateProfileDto,
    userId: number,
  ): Promise<CandidateProfile> {
    const candidateProfile = await this.findOneByUserId(userId);
    const updateData: any = { ...updateCandidateProfileDto };
    if (updateCandidateProfileDto.birthdate) {
      updateData.birthdate = new Date(updateCandidateProfileDto.birthdate);
    }
    Object.assign(candidateProfile, updateData);
    await this.candidateProfileRepository.save(candidateProfile);
    return this.findProfileWithDetails(candidateProfile.id);
  }

  async toggleOpenToWork(userId: number): Promise<CandidateProfile> {
    const candidateProfile = await this.candidateProfileRepository.findOne({
      where: { userId: userId },
    });
    if (!candidateProfile) {
      throw new NotFoundException(
        `Cannot find candidate profile with id: ${userId}`,
      );
    }
    candidateProfile.openToWork = !candidateProfile.openToWork;
    await this.candidateProfileRepository.save(candidateProfile);
    return this.findProfileWithDetails(candidateProfile.id);
  }

  async addCV(userId: number, file: Express.Multer.File) {
    const candidateProfile = await this.findOneByUserId(userId);
    const result = await this.cloudinaryService.uploadFile(file, 'pdfs');
    if (candidateProfile.cvPublicId) {
      await this.cloudinaryService.remove(candidateProfile.cvPublicId);
    }
    candidateProfile.cvUrl = result.secure_url;
    candidateProfile.cvPublicId = result.public_id;
    return this.candidateProfileRepository.save(candidateProfile);
  }

  async removeCV(userId: number) {
    const candidateProfile = await this.findOneByUserId(userId);
    if (!candidateProfile.cvPublicId) {
      return;
    }
    await this.cloudinaryService.remove(candidateProfile.cvPublicId.toString());
    candidateProfile.cvUrl = null;
    candidateProfile.cvPublicId = null;
    const saveProfile =
      await this.candidateProfileRepository.save(candidateProfile);
    return this.findProfileWithDetails(saveProfile.id);
  }

  async remove(userId: number): Promise<void> {
    const candidateProfile = await this.findOneByUserId(userId);
    await this.candidateProfileRepository.softRemove(candidateProfile);
  }

  async findOneByUserId(userId: number) {
    const candidate = await this.candidateProfileRepository.findOne({
      where: { userId: userId },
    });
    if (!candidate) {
      throw new NotFoundException('Candidate profile not found');
    }
    return candidate;
  }
  private async findProfileWithDetails(id: number) {
    const profile = await this.candidateProfileRepository.findOne({
      where: { id },
      relations: [
        'user',
        'candidateEducations',
        'candidateExperiences',
        'candidateSkills',
        'candidateSkills.skill',
        'candidateLanguages',
        'candidateLanguages.language',
      ],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
