import { BaseEntity } from 'src/common/entities/base.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Industry } from 'src/modules/industries/entities/industry.entity';
import { Entity, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';

@Entity('company_industries')
@Unique(['companyId', 'industryId'])
export class CompanyIndustry extends BaseEntity {
  @Column()
  companyId: number;

  @Column()
  industryId: number;

  @ManyToOne(() => Company, (company) => company.companyIndustries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Industry, (industry) => industry.companyIndustries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'industryId' })
  industry: Industry;
}
