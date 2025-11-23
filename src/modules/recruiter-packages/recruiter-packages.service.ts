import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
    userId: number,
    manager?: EntityManager,
  ): Promise<RecruiterPackage> {
    const { packageId } = createRecruiterPackageDto;
    const repo = manager
      ? manager.getRepository(RecruiterPackage)
      : this.recruiterPackageRepository;
    const activeRecruiterPackage = await this.findActivePackage(userId);
    const foundPackage =
      await this.packageService.findOneActivePackage(packageId);
    await this.userService.findById(userId);

    if (activeRecruiterPackage) {
      activeRecruiterPackage.remainingPost += foundPackage.jobPostLimit;
      const currentEndDate = new Date(activeRecruiterPackage.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(currentEndDate.getDate() + foundPackage.duration);
      activeRecruiterPackage.endDate = newEndDate;
      activeRecruiterPackage.packageId = foundPackage.id;
      const updatedPackage = await repo.save(activeRecruiterPackage);

      return repo.findOneOrFail({
        where: { id: updatedPackage.id },
        relations: ['package'],
      });
    } else {
      const startDate = new Date();
      const endDate = new Date(startDate);
      const durationDays = foundPackage.duration;
      endDate.setDate(startDate.getDate() + durationDays);
      const newRecruiterPackage = repo.create({
        packageId: foundPackage?.id,
        recruiterId: userId,
        startDate,
        endDate,
        remainingPost: foundPackage.jobPostLimit,
      });
      const savedPackage = await repo.save(newRecruiterPackage);
      return repo.findOneOrFail({
        where: { id: savedPackage.id },
        relations: ['package'],
      });
    }
  }

  async findActivePackage(
    recruiterId: number,
  ): Promise<RecruiterPackage | null> {
    const packages = await this.recruiterPackageRepository.findOne({
      where: {
        recruiterId: recruiterId,
      },
      order: { endDate: 'DESC' },
      relations: ['package'],
    });
    return packages;
  }

  async getMyPackage(recruiterId: number) {
    const pkg = await this.findActivePackage(recruiterId);
    if (!pkg)
      throw new NotFoundException('You have not registered for any package');
    return pkg;
  }

  async decreaseRemainingPost(id: number) {
    await this.recruiterPackageRepository.decrement({ id }, 'remainingPost', 1);
  }
}
