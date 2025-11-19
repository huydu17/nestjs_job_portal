import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CandidateSkillsService } from './candidate-skills.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SyncCandidateSkillsDto } from './dto/sync-candidate-skill.dto';

@Controller('candidate-skills')
@UseGuards(JwtAuthGuard)
export class CandidateSkillsController {
  constructor(private readonly candidateSkillService: CandidateSkillsService) {}

  @Post()
  async syncMySkills(
    @Body() syncCandidateSkillsDto: SyncCandidateSkillsDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateSkillService.syncMySkills(
      currentUser.id,
      syncCandidateSkillsDto,
    );
  }

  @Get('me')
  async findMySkills(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateSkillService.findMySkills(currentUser.id);
  }
}
