import { BaseEntity } from 'src/common/entities/base.entity';
import { CompanyIndustry } from 'src/modules/companies/entities/company-industry.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('industries')
export class Industry extends BaseEntity {
  @Column({ type: 'nvarchar', unique: true })
  name: string;

  @OneToMany(() => CompanyIndustry, (ci) => ci.industry)
  companyIndustries: CompanyIndustry[];
}
