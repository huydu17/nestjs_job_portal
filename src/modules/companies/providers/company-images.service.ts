/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { CompanyImage } from '../entities/company-image.entity';
import { CompaniesService } from '../companies.service';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/modules/cloudinary/cloudinary.response';

@Injectable()
export class CompanyImagesService {
  constructor(
    @InjectRepository(CompanyImage)
    private companyImageRepository: Repository<CompanyImage>,
    private companyService: CompaniesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async add(
    companyId: number,
    currentUser: AuthUser,
    files: Express.Multer.File[],
  ): Promise<CompanyImage[]> {
    await this.companyService.findOneEnsureOwner(companyId, currentUser.id);
    const uploadResults = await this.cloudinaryService.uploadMultipleFile(
      files,
      'company_images',
    );
    const newImages = uploadResults.map((result: CloudinaryResponse) => {
      return this.companyImageRepository.create({
        companyId: companyId,
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
    });
    return await this.companyImageRepository.save(newImages);
  }

  async findByCompanyId(companyId: number) {
    return await this.companyImageRepository.find({
      where: { companyId },
    });
  }

  async remove(companyImageId: number, userId: number) {
    const image = await this.companyImageRepository.findOne({
      where: { id: companyImageId },
      relations: ['company'],
    });
    if (!image) throw new NotFoundException('Image not found');
    if (image.company.userId !== userId) {
      throw new ForbiddenException('You cannot delete this image');
    }
    if (image.public_id) {
      await this.cloudinaryService.remove(image.public_id);
    }
    return await this.companyImageRepository.remove(image);
  }
}
