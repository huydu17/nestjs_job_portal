import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

const FIFTEEN_MB = 1024 * 1024 * 15;

@Controller('candidate-profiles')
@UseGuards(JwtAuthGuard)
export class CandidateProfilesController {
  constructor(
    private readonly candidateProfileService: CandidateProfilesService,
  ) {}

  @Post()
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
  async findAll(@Query() queryDto: PaginationQueryDto) {
    return await this.candidateProfileService.findAll(queryDto);
  }

  @Get('me')
  @ResponseMessage('Get candidate profile successfully')
  async getMyProfile(@CurrentUser() currentUser: AuthUser) {
    return await this.candidateProfileService.getMyProfile(currentUser.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.candidateProfileService.findOne(id);
  }

  @Put()
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
  async toggleOpenToWork(
    @CurrentUser() currentUser: AuthUser,
    @Body('openToWork') openToWork: boolean,
  ) {
    return await this.candidateProfileService.toggleOpenToWork(
      currentUser.id,
      openToWork,
    );
  }

  @Patch('upload-cv')
  @UseInterceptors(FileInterceptor('file'))
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
  async removeCV(@CurrentUser() user: AuthUser) {
    return this.candidateProfileService.removeCV(user.id);
  }

  @Delete()
  @ResponseMessage('Delete candidate profile successfully')
  async remove(@CurrentUser() currentUser: AuthUser) {
    await this.candidateProfileService.remove(currentUser.id);
  }
}
