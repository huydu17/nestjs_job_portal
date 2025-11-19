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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApproveCompanyDto } from './dto/approve-company.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CompanyImagesService } from './providers/company-images.service';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly imagesService: CompanyImagesService,
  ) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.companiesService.create(createCompanyDto, currentUser);
  }

  @Get()
  async findAll(@Query() queryDto: PaginationQueryDto) {
    return await this.companiesService.findAll(queryDto);
  }

  @Get('admin')
  async findAllForAdmin(@Query() queryDto: PaginationQueryDto) {
    return await this.companiesService.findAllForAdmin(queryDto);
  }

  @Get('me')
  async findMyCompanies(
    @Query() queryDto: PaginationQueryDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.companiesService.findMyCompanies(
      queryDto,
      currentUser.id,
    );
  }

  @Get(':id/admin')
  async findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return await this.companiesService.findOneAdmin(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return await this.companiesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.companiesService.update(
      id,
      updateCompanyDto,
      currentUser.id,
    );
  }

  @Post(':companyId/images')
  @UseInterceptors(FilesInterceptor('files', 10))
  async addImages(
    @Param('companyId') companyId: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /image\/(png|jpeg|jpg|webp)/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.imagesService.add(companyId, currentUser, files);
  }

  @Delete('images/:imageId')
  async removeImage(
    @Param('imageId') imageId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.imagesService.remove(imageId, currentUser.id);
  }

  @Patch(':id/approve')
  async approved(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveCompanyDto: ApproveCompanyDto,
  ) {
    return await this.companiesService.approved(id, approveCompanyDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.companiesService.remove(id, currentUser);
  }
}
