import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateSkill } from './entities/candidate-skill.entity';
import { CandidateProfilesService } from '../candidate-profiles/candidate-profiles.service';
import { SkillsService } from '../skills/skills.service';
import { SyncCandidateSkillsDto } from './dto/sync-candidate-skill.dto';

@Injectable()
export class CandidateSkillsService {
  constructor(
    @InjectRepository(CandidateSkill)
    private candidateSkillRepository: Repository<CandidateSkill>,
    private candidateProfileService: CandidateProfilesService,
    private skillService: SkillsService,
  ) {}

  async syncMySkills(userId: number, syncSkillsDto: SyncCandidateSkillsDto) {
    const { skillIds } = syncSkillsDto;
    const uniqueSkills = [...new Set(skillIds)];
    if (uniqueSkills.length > 0) {
      const foundSkills =
        await this.skillService.checkAllSkillIds(uniqueSkills);
      if (foundSkills.length !== uniqueSkills.length) {
        throw new BadRequestException('One or more skills dont exist');
      }
    }
    const candidateProfile =
      await this.candidateProfileService.findOneByUserId(userId);
    const currentAssignments = await this.candidateSkillRepository.find({
      where: { candidateProfileId: candidateProfile.id },
    });
    const currentSkillIds = currentAssignments.map((a) => a.skillId);
    const skillsToAddIds = uniqueSkills.filter(
      (id) => !currentSkillIds.includes(id),
    );
    const assignmentsToRemove = currentAssignments.filter(
      (a) => !uniqueSkills.includes(a.skillId),
    );
    await this.candidateSkillRepository.manager.transaction(
      async (transactionalEntityManager) => {
        if (assignmentsToRemove.length > 0) {
          await transactionalEntityManager.remove(assignmentsToRemove);
        }
        if (skillsToAddIds.length > 0) {
          const newAssignments = skillsToAddIds.map((skillId) =>
            this.candidateSkillRepository.create({
              candidateProfileId: candidateProfile.id,
              skillId,
            }),
          );
          await transactionalEntityManager.save(newAssignments);
        }
      },
    );
    return this.findMySkills(userId);
  }

  async findMySkills(userId: number): Promise<CandidateSkill[]> {
    const candidateProfile =
      await this.candidateProfileService.findOneByUserId(userId);
    return await this.candidateSkillRepository.find({
      where: { candidateProfileId: candidateProfile.id },
      relations: ['skill'],
    });
  }
}
