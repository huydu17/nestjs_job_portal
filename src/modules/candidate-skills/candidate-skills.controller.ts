import { Controller, Get, Body, Put } from '@nestjs/common';
import { CandidateSkillsService } from './candidate-skills.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SyncCandidateSkillsDto } from './dto/sync-candidate-skill.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CandidateSkillResponseDto } from './dto/candidate-skill-response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('Candidates')
@ApiBearerAuth()
@Controller('candidate-skills')
export class CandidateSkillsController {
  constructor(private readonly candidateSkillService: CandidateSkillsService) {}

  @Put()
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateSkillResponseDto)
  @ApiOperation({
    summary: 'Sync skills',
    description: 'Send a list of skillId',
  })
  @ApiBody({ type: SyncCandidateSkillsDto })
  @ResponseMessage('Skills synced successfully')
  @ApiResponse({ status: 200, description: 'Skills updated.' })
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
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateSkillResponseDto)
  @ApiOperation({ summary: 'Get my skills list' })
  @ApiResponse({ status: 200, description: 'Return list of skills.' })
  async findMySkills(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateSkillService.findMySkills(currentUser.id);
  }
}
