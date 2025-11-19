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
    const candidate = await this.candidateProfileRepository.findOne({
      where: { userId: currentUser.id },
    });
    if (candidate) {
      throw new BadRequestException('User already has a candidate profile');
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
    return candidateProfile;
  }

  async findAll(queryDto: PaginationQueryDto) {
    const { filter } = queryDto;
    const whereCondition: any = { status: true };
    if (filter) {
      whereCondition.fullName = Like(`%${filter}%`);
    }
    const candidates = await this.paginationService.paginateQuery(
      queryDto,
      this.candidateProfileRepository,
      whereCondition,
    );
    return candidates;
  }

  async findOne(id: number): Promise<CandidateProfile> {
    const candidateProfile = await this.candidateProfileRepository.findOne({
      where: { id, status: true },
      relations: [
        'candidateLanguages',
        'candidateEducations',
        'candidateSkills',
        'candidateExperiences',
      ],
    });
    if (!candidateProfile) {
      throw new NotFoundException(
        `Cannot find candidate profile with id: ${id}`,
      );
    }
    return candidateProfile;
  }

  async getMyProfile(userId: number): Promise<CandidateProfile> {
    const candidateProfile = await this.candidateProfileRepository.findOne({
      where: { userId: userId },
      relations: [
        'candidateLanguages',
        'candidateEducations',
        'candidateSkills',
        'candidateExperiences',
      ],
    });
    if (!candidateProfile) {
      throw new NotFoundException('Candidate profile not found');
    }
    return candidateProfile;
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
    return await this.candidateProfileRepository.save(candidateProfile);
  }

  async toggleOpenToWork(
    userId: number,
    openToWork: boolean,
  ): Promise<CandidateProfile> {
    const candidateProfile = await this.candidateProfileRepository.findOne({
      where: { userId: userId },
    });
    if (!candidateProfile) {
      throw new NotFoundException(
        `Cannot find candidate profile with id: ${userId}`,
      );
    }
    candidateProfile.openToWork = openToWork;
    return await this.candidateProfileRepository.save(candidateProfile);
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
    candidateProfile.cvUrl = undefined;
    candidateProfile.cvPublicId = undefined;
    return this.candidateProfileRepository.save(candidateProfile);
  }

  async remove(userId: number): Promise<void> {
    const candidateProfile = await this.findOneByUserId(userId);
    await this.candidateProfileRepository.remove(candidateProfile);
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
}
