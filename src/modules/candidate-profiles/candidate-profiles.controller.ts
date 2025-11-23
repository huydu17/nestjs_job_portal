import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@roles/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import {
  CandidateListItemDto,
  CandidateProfileResponseDto,
} from './dto/response-profile.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

const FIFTEEN_MB = 1024 * 1024 * 15;

@ApiTags('Candidates')
@ApiBearerAuth()
@Controller('candidate-profiles')
export class CandidateProfilesController {
  constructor(
    private readonly candidateProfileService: CandidateProfilesService,
  ) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateProfileResponseDto)
  @ApiOperation({ summary: 'Create candidate profile' })
  @ResponseMessage('Profile created successfully')
  @ApiResponse({ status: 201, description: 'Profile created.' })
  async create(
    @Body() createCandidateProfileDto: CreateCandidateProfileDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.candidateProfileService.create(
      createCandidateProfileDto,
      currentUser,
    );
  }

  @Get()
  @Roles(Role.RECRUITER, Role.ADMIN)
  @Serialize(CandidateListItemDto)
  @ApiOperation({ summary: 'Get list of candidates (Recruiter/Admin only)' })
  @ApiResponse({ status: 200, description: 'List of candidates.' })
  async findAll(@Query() queryDto: PaginationQueryDto) {
    return await this.candidateProfileService.findAll(queryDto);
  }

  @Get('me')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateProfileResponseDto)
  @ApiOperation({ summary: 'Get my profile details' })
  @ResponseMessage('Get candidate profile successfully')
  async getMyProfile(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateProfileService.getMyProfile(currentUser.id);
  }

  @Get(':id')
  @Roles(Role.RECRUITER, Role.ADMIN)
  @Serialize(CandidateProfileResponseDto)
  @ApiOperation({ summary: 'View candidate details (Recruiter only)' })
  @ApiParam({ name: 'id', description: 'Candidate Profile ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.candidateProfileService.findOne(id);
  }

  @Put('me')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateProfileResponseDto)
  @ApiOperation({ summary: 'Update my profile information' })
  @ResponseMessage('Profile updated successfully')
  async update(
    @Body() updateCandidateProfileDto: UpdateCandidateProfileDto,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.candidateProfileService.update(
      updateCandidateProfileDto,
      user.id,
    );
  }

  @Patch('toggle-open-to-work')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateProfileResponseDto)
  @ApiOperation({ summary: 'Turn on/off "Open To Work" status' })
  @ResponseMessage('Status updated successfully')
  async toggleOpenToWork(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateProfileService.toggleOpenToWork(currentUser.id);
  }

  @Patch('upload-cv')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateProfileResponseDto)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload CV (PDF only, Max 15MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ResponseMessage('CV uploaded successfully')
  async uploadCV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FIFTEEN_MB }),
          new FileTypeValidator({
            fileType: /application\/(pdf)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    return this.candidateProfileService.addCV(user.id, file);
  }

  @Delete('cv')
  @Roles(Role.CANDIDATE)
  @Serialize(CandidateProfileResponseDto)
  @ApiOperation({ summary: 'Remove current CV' })
  @ResponseMessage('CV removed successfully')
  async removeCV(@CurrentUser() user: AuthUser) {
    return this.candidateProfileService.removeCV(user.id);
  }

  @Delete('me')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Delete my profile' })
  @ResponseMessage('Delete candidate profile successfully')
  @ResponseMessage('Delete candidate profile successfully')
  async remove(@CurrentUser() currentUser: AuthUser) {
    await this.candidateProfileService.remove(currentUser.id);
  }
}
