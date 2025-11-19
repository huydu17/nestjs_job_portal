import { BaseEntity } from 'src/common/entities/base.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('company_images')
export class CompanyImage extends BaseEntity {
  @Column()
  companyId: number;

  @Column()
  imageUrl: string;

  @Column()
  public_id: string;

  @ManyToOne(() => Company, (company) => company.companyImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
