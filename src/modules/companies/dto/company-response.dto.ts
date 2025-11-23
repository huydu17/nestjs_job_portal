/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform, Type } from 'class-transformer';

class CompanyImageResponseDto {
  @Expose()
  id: number;

  @Expose()
  imageUrl: string;
}

class CompanyIndustryResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.industry?.id)
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.industry?.name)
  name: string;
}

export class CompanyResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  teamSize: number;

  @Expose()
  establishmentDate: Date;

  @Expose()
  websiteUrl: string;

  @Expose()
  address: string;

  @Expose()
  city: string;

  @Expose()
  mapLink: string;

  @Expose()
  isApproved: boolean;

  @Expose()
  @Type(() => CompanyImageResponseDto)
  companyImages: CompanyImageResponseDto[];

  @Expose()
  @Type(() => CompanyIndustryResponseDto)
  companyIndustries: CompanyIndustryResponseDto[];
}
