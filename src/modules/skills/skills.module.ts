import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from '@users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), RedisModule, UserModule],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
