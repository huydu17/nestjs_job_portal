/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform } from 'class-transformer';

export class RecruiterPackageResponseDto {
  @Expose()
  id: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  remainingPost: number;

  @Expose()
  @Transform(({ obj }) => obj.package?.id)
  packageId: number;

  @Expose()
  @Transform(({ obj }) => obj.package?.label)
  packageName: string;

  @Expose()
  @Transform(({ obj }) => obj.package?.jobPostLimit)
  originalLimit: number;
}
