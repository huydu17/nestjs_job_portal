import { Expose } from 'class-transformer';

export class ResponsePackage {
  @Expose()
  id: number;
  @Expose()
  label: string;
  @Expose()
  price: string;
  @Expose()
  jobPostLimit: boolean;
  @Expose()
  isActive: boolean;
  @Expose()
  createdAt: string;
}
