import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateCandidateEducationDto } from './dto/create-candidate-education.dto';
import { UpdateCandidateEducationDto } from './dto/update-candidate-education.dto';
import { CandidateEducationsService } from './candidate-educations.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Role } from '@roles/enums/role.enum';
import { CandidateEducationResponseDto } from './dto/education-response.dto';

@ApiTags('Candidates')
@ApiBearerAuth()
@Controller('candidate-educations')
export class CandidateEducationsController {
  constructor(
    private readonly candidateEducationsService: CandidateEducationsService,
  ) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateEducationResponseDto)
  @ApiOperation({ summary: 'Add new education record' })
  @ResponseMessage('Education added successfully')
  @ApiResponse({ status: 201, description: 'Education record created.' })
  async create(
    @Body() createCandidateEducationDto: CreateCandidateEducationDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateEducationsService.create(
      createCandidateEducationDto,
      currentUser.id,
    );
  }

  @Get('me')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateEducationResponseDto)
  @ApiOperation({ summary: 'Get my education history' })
  @ApiResponse({ status: 200, description: 'List of education records.' })
  async findMyEducations(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateEducationsService.findMyEducations(
      currentUser.id,
    );
  }

  @Patch(':educationId')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateEducationResponseDto)
  @ApiOperation({ summary: 'Update education details' })
  @ApiParam({
    name: 'educationId',
    description: 'ID of education record',
    example: 1,
  })
  @ResponseMessage('Education updated successfully')
  @ApiResponse({ status: 200, description: 'Education record updated.' })
  async update(
    @Param('educationId') educationId: number,
    @Body() updateCandidateEducationDto: UpdateCandidateEducationDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateEducationsService.update(
      educationId,
      updateCandidateEducationDto,
      currentUser.id,
    );
  }

  @Delete(':educationId')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Delete education record' })
  @ApiParam({ name: 'educationId', example: 1 })
  @ResponseMessage('Education deleted successfully')
  @ApiResponse({ status: 200, description: 'Education record deleted.' })
  async remove(
    @Param('educationId') educationId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.candidateEducationsService.remove(educationId, currentUser.id);
  }
}
