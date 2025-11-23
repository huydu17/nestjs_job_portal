import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateRecruiterPackageDto } from './dto/create-recruiter-package.dto';
import { RecruiterPackagesService } from './recruiter-packages.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@roles/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { RecruiterPackageResponseDto } from './dto/recruiter-package-response.dto';

@ApiTags('Recruiter Packages')
@ApiBearerAuth()
@Controller('recruiter-packages')
export class RecruiterPackagesController {
  constructor(
    private readonly recruiterPackageService: RecruiterPackagesService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @Serialize(RecruiterPackageResponseDto)
  @ApiOperation({ summary: 'Manually grant a package to a user (Admin only)' })
  @ResponseMessage('Package granted successfully')
  @ApiResponse({ status: 201, description: 'Package created.' })
  async create(
    @Body() createRecruiterPackageDto: CreateRecruiterPackageDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.recruiterPackageService.create(
      createRecruiterPackageDto,
      currentUser.id,
    );
  }

  @Get('me')
  @Roles(Role.RECRUITER)
  @Serialize(RecruiterPackageResponseDto)
  @ApiOperation({ summary: 'Check my active package & remaining posts' })
  @ApiResponse({ status: 200, description: 'Current active package details.' })
  @ApiResponse({ status: 404, description: 'No active package found.' })
  async findMyPackage(@CurrentUser() currentUser: User) {
    return await this.recruiterPackageService.getMyPackage(currentUser.id);
  }
}
