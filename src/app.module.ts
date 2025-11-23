import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environmentValidation from './configs/environment.validation';
import databaseConfig from './configs/database.config';
import appConfig from './configs/app.config';
import { UserModule } from '@users/user.module';
import { AuthModule } from '@auth/auth.module';
import { RolesModule } from '@roles/roles.module';
import { User } from '@users/entities/user.entity';
import { Role } from '@roles/entities/role.entity';
import { Application } from './modules/applications/entities/application.entity';
import { CandidateEducation } from './modules/candidate-educations/entities/candidate-education.entity';
import { CandidateProfile } from './modules/candidate-profiles/entities/candidate-profile.entity';
import { CandidateExperience } from './modules/candidate-experiences/entities/candidate-experience.entity';
import { CandidateLanguage } from './modules/candidate-languages/entities/candidate-language.entity';
import { CandidateSkill } from './modules/candidate-skills/entities/candidate-skill.entity';
import { Company } from './modules/companies/entities/company.entity';
import { Job } from './modules/jobs/entities/job.entity';
import { Order } from './modules/orders/entities/order.entity';
import { Package } from './modules/packages/entities/package.entity';
import { RecruiterPackage } from './modules/recruiter-packages/entities/recruiter-package.entity';
import { CandidateProfilesModule } from './modules/candidate-profiles/candidate-profiles.module';
import { CandidateEducationsModule } from './modules/candidate-educations/candidate-educations.module';
import { CandidateExperiencesModule } from './modules/candidate-experiences/candidate-experiences.module';
import { CandidateSkillsModule } from './modules/candidate-skills/candidate-skills.module';
import { CandidateLanguagesModule } from './modules/candidate-languages/candidate-languages.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PackagesModule } from './modules/packages/packages.module';
import { RecruiterPackagesModule } from './modules/recruiter-packages/recruiter-packages.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { UserRole } from './modules/user-roles/entities/user-role.entity';
import { RedisModule } from './redis/redis.module';
import { BenefitsModule } from './modules/benefits/benefits.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { IndustriesModule } from './modules/industries/industries.module';
import { SkillsModule } from './modules/skills/skills.module';
import { Benefit } from './modules/benefits/entities/benefit.entity';
import { Industry } from './modules/industries/entities/industry.entity';
import { Language } from './modules/languages/entities/language.entity';
import { Skill } from './modules/skills/entities/skill.entity';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { JobBenefit } from './modules/jobs/entities/job-benefit.entity';
import { JobSkill } from './modules/jobs/entities/job-skill.entity';
import { PaymentModule } from './modules/payment/payment.module';
import { CompanyImage } from './modules/companies/entities/company-image.entity';
import { CompanyIndustry } from './modules/companies/entities/company-industry.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/role.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ApplicationsModule } from './modules/applications/applications.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [
          User,
          Role,
          UserRole,
          Application,
          CandidateEducation,
          CandidateProfile,
          CandidateExperience,
          CandidateLanguage,
          CandidateSkill,
          Company,
          CompanyImage,
          CompanyIndustry,
          Job,
          JobBenefit,
          JobSkill,
          Order,
          Package,
          RecruiterPackage,
          Benefit,
          Industry,
          Language,
          Skill,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    UserModule,
    AuthModule,
    RolesModule,
    UserRolesModule,
    CandidateProfilesModule,
    CandidateEducationsModule,
    CandidateExperiencesModule,
    CandidateSkillsModule,
    CandidateLanguagesModule,
    CompaniesModule,
    JobsModule,
    OrdersModule,
    PackagesModule,
    RecruiterPackagesModule,
    UserRolesModule,
    BenefitsModule,
    LanguagesModule,
    IndustriesModule,
    SkillsModule,
    CloudinaryModule,
    PaymentModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
