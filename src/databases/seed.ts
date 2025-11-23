/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

import { SEED_ROLES } from './data/role';
import { SEED_USERS } from './data/user';
import { SEED_PACKAGES } from './data/package';
import { SEED_INDUSTRIES } from './data/industry';
import { SEED_SKILLS } from './data/skill';
import { SEED_BENEFITS } from './data/benefit';
import { AppModule } from 'src/app.module';
import { Role } from '@roles/entities/role.entity';
import { User } from '@users/entities/user.entity';
import { UserRole } from 'src/modules/user-roles/entities/user-role.entity';
import { Package } from 'src/modules/packages/entities/package.entity';
import { Industry } from 'src/modules/industries/entities/industry.entity';
import { Skill } from 'src/modules/skills/entities/skill.entity';
import { Benefit } from 'src/modules/benefits/entities/benefit.entity';
import { Language } from 'src/modules/languages/entities/language.entity';
import { SEED_LANGUAGES } from './data/language';

enum RoleName {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  CANDIDATE = 'candidate',
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  console.log('STARTING DATABASE SEEDING...');
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);
  const packageRepo = dataSource.getRepository(Package);
  const industryRepo = dataSource.getRepository(Industry);
  const skillRepo = dataSource.getRepository(Skill);
  const benefitRepo = dataSource.getRepository(Benefit);
  const languageRepo = dataSource.getRepository(Language);
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');

    await queryRunner.query('TRUNCATE TABLE user_roles');
    await queryRunner.query('TRUNCATE TABLE users');
    await queryRunner.query('TRUNCATE TABLE roles');
    await queryRunner.query('TRUNCATE TABLE packages');
    await queryRunner.query('TRUNCATE TABLE industries');
    await queryRunner.query('TRUNCATE TABLE skills');
    await queryRunner.query('TRUNCATE TABLE benefits');
    await queryRunner.query('TRUNCATE TABLE languages');

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database cleared!');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await queryRunner.release();
  }

  for (const roleData of SEED_ROLES) {
    const exists = await roleRepo.findOneBy({ name: roleData.name });
    if (!exists) {
      await roleRepo.save(roleData);
    }
  }

  for (const userData of SEED_USERS) {
    const exists = await userRepo.findOneBy({ email: userData.email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await userRepo.save({
        ...userData,
        password: hashedPassword,
        status: true,
      });
      if (userData.email.includes('admin')) {
        const role = await roleRepo.findOneBy({ name: RoleName.ADMIN });
        if (role) {
          await userRoleRepo.save({
            userId: newUser.id,
            roleId: role.id,
          });
        }
      }
      if (userData.email.includes('candidate')) {
        const role = await roleRepo.findOneBy({
          name: RoleName.CANDIDATE,
        });
        if (role) {
          await userRoleRepo.save({
            userId: newUser.id,
            roleId: role.id,
          });
        }
      }
      if (userData.email.includes('recruiter')) {
        const role = await roleRepo.findOneBy({
          name: RoleName.RECRUITER,
        });
        if (role) {
          await userRoleRepo.save({
            userId: newUser.id,
            roleId: role.id,
          });
        }
      }
    }
  }

  for (const pkg of SEED_PACKAGES) {
    const exists = await packageRepo.findOneBy({ label: pkg.label });
    if (!exists) {
      await packageRepo.save(pkg);
    }
  }

  for (const item of SEED_INDUSTRIES) {
    const name = typeof item === 'string' ? item : (item as any).name;
    if (!(await industryRepo.findOneBy({ name }))) {
      await industryRepo.save({ name });
    }
  }

  for (const item of SEED_SKILLS) {
    const name = typeof item === 'string' ? item : (item as any).name;
    if (!(await skillRepo.findOneBy({ name }))) {
      await skillRepo.save({ name });
    }
  }

  for (const item of SEED_BENEFITS) {
    const name = typeof item === 'string' ? item : (item as any).name;
    if (!(await benefitRepo.findOneBy({ name }))) {
      await benefitRepo.save({ name });
    }
  }

  for (const item of SEED_LANGUAGES) {
    const name = typeof item === 'string' ? item : (item as any).name;
    if (!(await languageRepo.findOneBy({ name }))) {
      await languageRepo.save({ name });
    }
  }

  console.log('SEEDING COMPLETED SUCCESSFULLY!');
  await app.close();
}
bootstrap();
