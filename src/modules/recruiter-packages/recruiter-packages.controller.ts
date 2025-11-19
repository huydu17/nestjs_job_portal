import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateRecruiterPackageDto } from './dto/create-recruiter-package.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RecruiterPackagesService } from './recruiter-packages.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@users/entities/user.entity';

@Controller('recruiter-packages')
@UseGuards(JwtAuthGuard)
export class RecruiterPackagesController {
  constructor(
    private readonly recruiterPackageService: RecruiterPackagesService,
  ) {}

  @Post()
  async create(
    @Body() createRecruiterPackageDto: CreateRecruiterPackageDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.recruiterPackageService.create(
      createRecruiterPackageDto,
      currentUser,
    );
  }

  @Get('me')
  async findMyPackage(@CurrentUser() currentUser: User) {
    return await this.recruiterPackageService.getMyPackage(currentUser.id);
  }
}
