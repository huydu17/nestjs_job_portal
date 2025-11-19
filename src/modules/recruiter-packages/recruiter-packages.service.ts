import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecruiterPackageDto } from './dto/create-recruiter-package.dto';
import { RecruiterPackage } from './entities/recruiter-package.entity';
import { UserService } from '@users/user.service';
import { PackagesService } from '../packages/packages.service';

@Injectable()
export class RecruiterPackagesService {
  constructor(
    @InjectRepository(RecruiterPackage)
    private recruiterPackageRepository: Repository<RecruiterPackage>,
    private packageService: PackagesService,
    private userService: UserService,
  ) {}

  async create(
    createRecruiterPackageDto: CreateRecruiterPackageDto,
    currentUser: AuthUser,
  ): Promise<RecruiterPackage> {
    const { packageId } = createRecruiterPackageDto;
    const activeRecruiterPackage = await this.findActivePackage(currentUser.id);
    if (activeRecruiterPackage) {
      throw new BadRequestException('You cannot buy this package');
    }

    const foundPackage =
      await this.packageService.findOneActivePackage(packageId);
    await this.userService.findById(currentUser.id);

    const startDate = new Date();
    const endDate = new Date(startDate);
    const durationDays = foundPackage.duration;
    endDate.setDate(startDate.getDate() + durationDays);

    const newRecruiterPackage = this.recruiterPackageRepository.create({
      packageId: foundPackage?.id,
      recruiterId: currentUser?.id,
      startDate,
      endDate,
      remainingPost: foundPackage.jobPostLimit,
    });
    return await this.recruiterPackageRepository.save(newRecruiterPackage);
  }

  async findActivePackage(
    recruiterId: number,
  ): Promise<RecruiterPackage | null> {
    const today = new Date();
    const packages = await this.recruiterPackageRepository.findOne({
      where: {
        recruiterId: recruiterId,
      },
      order: { endDate: 'DESC' },
      relations: ['package'],
    });
    if (packages && packages.endDate > today) return packages;
    return null;
  }

  async getMyPackage(recruiterId: number) {
    const pkg = await this.findActivePackage(recruiterId);
    if (!pkg)
      throw new NotFoundException('You have not registered for any package');
    return pkg;
  }

  // recruiter-packages.service.ts
  async decreaseRemainingPost(id: number) {
    await this.recruiterPackageRepository.decrement({ id }, 'remainingPost', 1);
  }
}
