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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApproveCompanyDto } from './dto/approve-company.dto';
import { CompaniesService } from './companies.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CompanyImagesService } from './providers/company-images.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CompanyResponseDto } from './dto/company-response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly imagesService: CompanyImagesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @Serialize(CompanyResponseDto)
  @ApiOperation({ summary: 'Create a new company profile' })
  @ResponseMessage('Company created successfully')
  @ApiResponse({
    status: 201,
    description: 'Company created (Pending approval).',
  })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return await this.companiesService.create(createCompanyDto, currentUser);
  }

  @Get()
  @Public()
  @Serialize(CompanyResponseDto)
  @ApiOperation({ summary: 'Get list of approved companies' })
  @ApiResponse({ status: 200, description: 'List of companies.' })
  @ResponseMessage('Get list of approved companies')
  async findAll(@Query() queryDto: PaginationQueryDto) {
    return await this.companiesService.findAll(queryDto);
  }

  @Get('admin')
  @ApiBearerAuth()
  @Serialize(CompanyResponseDto)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all companies (Admin view - including pending)',
  })
  @ApiResponse({ status: 200, description: 'Full list of companies.' })
  @ApiOperation({ summary: 'Get list of approved companies' })
  @ResponseMessage('Get all companies')
  async findAllForAdmin(@Query() queryDto: PaginationQueryDto) {
    return await this.companiesService.findAllForAdmin(queryDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @Serialize(CompanyResponseDto)
  @ApiOperation({ summary: 'Get companies created by me' })
  @ApiResponse({ status: 200, description: 'List of my companies.' })
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
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Serialize(CompanyResponseDto)
  @ApiOperation({ summary: 'Get company details (Admin view)' })
  @ApiParam({ name: 'id', example: 1 })
  async findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return await this.companiesService.findOneAdmin(id);
  }

  @Get(':id')
  @Public()
  @Serialize(CompanyResponseDto)
  @ApiOperation({ summary: 'Get company details (Public view)' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Serialize(CompanyResponseDto)
  @Roles(Role.RECRUITER)
  @ApiOperation({ summary: 'Update company details' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Company updated successfully')
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
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @ApiOperation({ summary: 'Upload company gallery images (Max 10 files)' })
  @ApiParam({ name: 'companyId', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ResponseMessage('Images uploaded successfully')
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
  @ApiBearerAuth()
  @Roles(Role.RECRUITER)
  @ApiOperation({ summary: 'Delete a gallery image' })
  @ApiParam({ name: 'imageId', example: 1 })
  @ResponseMessage('Image deleted successfully')
  async removeImage(
    @Param('imageId') imageId: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.imagesService.remove(imageId, currentUser.id);
  }

  @Patch(':id/approve')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Serialize(CompanyResponseDto)
  @ApiOperation({ summary: 'Approve/Reject company (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Company status updated')
  async approved(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveCompanyDto: ApproveCompanyDto,
  ) {
    return await this.companiesService.approved(id, approveCompanyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.RECRUITER)
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Company deleted successfully')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.companiesService.remove(id, currentUser);
  }
}
